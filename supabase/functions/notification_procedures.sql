
-- Function to insert a notification
CREATE OR REPLACE FUNCTION public.insert_notification(
  p_user_id UUID,
  p_title TEXT,
  p_message TEXT,
  p_type TEXT,
  p_read BOOLEAN
) RETURNS BOOLEAN AS $$
BEGIN
  INSERT INTO notifications (
    user_id,
    title,
    message,
    type,
    read,
    created_at
  ) VALUES (
    p_user_id,
    p_title,
    p_message,
    p_type,
    p_read,
    NOW()
  );
  RETURN TRUE;
EXCEPTION WHEN OTHERS THEN
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get public notifications
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

-- Function to mark notification as read
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
