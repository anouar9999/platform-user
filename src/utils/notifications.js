// utils/notifications.js
import axios from "axios";

const createDatabaseNotification = async (userId, message, senderName = 'System') => {
  try {
    if (!userId || !message) {
      console.error('Missing required parameters: userId or message');
      return false;
    }

    console.log('Creating notification:', { userId, senderName });

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/notifications.php?action=create`,
      {
        target_user_id: parseInt(userId),
        user_id: parseInt(userId),
        message: message.trim(),
        sender_name: senderName
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
      }
    );
    
    if (response.data.success) {
      console.log('Notification created with ID:', response.data.notification_id);
      
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('notificationCreated', {
          detail: {
            notificationId: response.data.notification_id,
            userId,
            message
          }
        }));
      }
      
      return true;
    } else {
      console.error('Failed to create notification:', response.data.error);
      return false;
    }
  } catch (error) {
    console.error('Error creating notification:', error.message);
    if (error.response) {
      console.error('Error response:', error.response.data);
    }
    return false;
  }
};

export default createDatabaseNotification;