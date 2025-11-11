-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('user', 'organizer', 'admin');

-- Create profiles table (without role field for security)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create user_roles table for secure role management
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Create events table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  location TEXT NOT NULL,
  price NUMERIC NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT FALSE,
  total_tickets INTEGER NOT NULL,
  available_tickets INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create tickets table
CREATE TABLE public.tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  customer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ticket_type TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  qr_code TEXT NOT NULL,
  barcode TEXT NOT NULL,
  access_code TEXT NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  purchase_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Profiles RLS policies
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- User roles RLS policies
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Events RLS policies (public read, admin/organizer write)
CREATE POLICY "Anyone can view events"
  ON public.events FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert events"
  ON public.events FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'organizer'));

CREATE POLICY "Admins can update events"
  ON public.events FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'organizer'));

CREATE POLICY "Admins can delete events"
  ON public.events FOR DELETE
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'organizer'));

-- Tickets RLS policies
CREATE POLICY "Users can view their own tickets"
  ON public.tickets FOR SELECT
  USING (auth.uid() = customer_id OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'organizer'));

CREATE POLICY "Authenticated users can create tickets"
  ON public.tickets FOR INSERT
  WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Admins can update tickets"
  ON public.tickets FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'organizer'));

-- Notifications RLS policies
CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can create notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    NEW.email
  );
  
  -- Give default 'user' role to new users
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Notification RPC functions
CREATE OR REPLACE FUNCTION public.insert_notification(
  p_user_id UUID,
  p_title TEXT,
  p_message TEXT,
  p_type TEXT,
  p_read BOOLEAN
) RETURNS BOOLEAN AS $$
BEGIN
  INSERT INTO notifications (user_id, title, message, type, read, created_at)
  VALUES (p_user_id, p_title, p_message, p_type, p_read, NOW());
  RETURN TRUE;
EXCEPTION WHEN OTHERS THEN
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_public_notifications()
RETURNS TABLE (
  id UUID,
  user_id UUID,
  title TEXT,
  message TEXT,
  type TEXT,
  read BOOLEAN,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT n.id, n.user_id, n.title, n.message, n.type, n.read, n.created_at
  FROM notifications n
  WHERE n.user_id IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.mark_notification_read(
  p_notification_id UUID
) RETURNS BOOLEAN AS $$
BEGIN
  UPDATE notifications
  SET read = TRUE
  WHERE id = p_notification_id;
  RETURN TRUE;
EXCEPTION WHEN OTHERS THEN
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;