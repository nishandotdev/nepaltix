
-- Function to get notifications for a specific user
CREATE OR REPLACE FUNCTION public.get_user_notifications(
  p_user_id UUID
)
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
  WHERE n.user_id = p_user_id
  ORDER BY n.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get notification by id
CREATE OR REPLACE FUNCTION public.get_notification_by_id(
  p_notification_id UUID
)
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
  WHERE n.id = p_notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update notification
CREATE OR REPLACE FUNCTION public.update_notification(
  p_notification_id UUID,
  p_updates JSONB
) RETURNS BOOLEAN AS $$
DECLARE
  update_query TEXT := 'UPDATE notifications SET ';
  comma BOOLEAN := FALSE;
BEGIN
  IF p_updates ? 'title' THEN
    update_query := update_query || 'title = ' || quote_literal(p_updates->>'title');
    comma := TRUE;
  END IF;

  IF p_updates ? 'message' THEN
    IF comma THEN update_query := update_query || ', '; END IF;
    update_query := update_query || 'message = ' || quote_literal(p_updates->>'message');
    comma := TRUE;
  END IF;

  IF p_updates ? 'type' THEN
    IF comma THEN update_query := update_query || ', '; END IF;
    update_query := update_query || 'type = ' || quote_literal(p_updates->>'type');
    comma := TRUE;
  END IF;

  IF p_updates ? 'read' THEN
    IF comma THEN update_query := update_query || ', '; END IF;
    update_query := update_query || 'read = ' || (p_updates->>'read')::BOOLEAN;
    comma := TRUE;
  END IF;

  -- Add WHERE clause
  update_query := update_query || ' WHERE id = ' || quote_literal(p_notification_id);

  -- Execute the query
  EXECUTE update_query;
  RETURN TRUE;
EXCEPTION WHEN OTHERS THEN
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to delete notification
CREATE OR REPLACE FUNCTION public.delete_notification(
  p_notification_id UUID
) RETURNS BOOLEAN AS $$
BEGIN
  DELETE FROM notifications
  WHERE id = p_notification_id;
  RETURN TRUE;
EXCEPTION WHEN OTHERS THEN
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
