-- User Deletion Audit Table
CREATE TABLE IF NOT EXISTS user_deletion_audit (
    id SERIAL PRIMARY KEY,
    user_id INT,
    reason TEXT,
    deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed BOOLEAN DEFAULT FALSE
);

-- Trigger Function to Log User Deletion Metadata
CREATE OR REPLACE FUNCTION log_user_deletion_metadata()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_deletion_audit (user_id, reason, deleted_at)
    VALUES (NEW.userId, NEW.reason, NEW.deletedAt);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger on UserDeletionReason Table
CREATE TRIGGER user_deletion_metadata_trigger
AFTER INSERT ON "UserDeletionReason"
FOR EACH ROW
EXECUTE FUNCTION log_user_deletion_metadata();

-- IT Notifications Table (optional)
CREATE TABLE IF NOT EXISTS it_notifications (
    id SERIAL PRIMARY KEY,
    report_id INT,
    message TEXT,
    notified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Function to Notify IT About Instructor Reports
CREATE OR REPLACE FUNCTION notify_it_about_report()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO it_notifications (report_id, message, notified_at)
    VALUES (NEW.id, 'New instructor report submitted', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger on Reports Table (replace with actual table name if different)
CREATE TRIGGER report_notification_trigger
AFTER INSERT ON "UserDeletionReason"
FOR EACH ROW
EXECUTE FUNCTION notify_it_about_report();