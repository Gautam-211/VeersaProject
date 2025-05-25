import { differenceInHours, isPast, parse } from 'date-fns';
import * as Notifications from 'expo-notifications';
import { useEffect, useRef } from 'react';
import { useGlobalContext } from '../context/GlobalProvider'; // Adjust path as needed

// Configure how notifications are handled when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function NotificationScheduler() {
  const { recentAppointment } = useGlobalContext();
  const notificationScheduledRef = useRef(null); // Stores the ID of the appointment for which notification is scheduled
  const latestAppointmentRef = useRef(recentAppointment); // Ref to hold the latest recentAppointment state
  const intervalIdRef = useRef(null); // Stores the ID of the setInterval

  // This useEffect updates the ref whenever recentAppointment state changes.
  // It ensures the interval's callback always has access to the most current appointment.
  useEffect(() => {
    latestAppointmentRef.current = recentAppointment;
    // If recentAppointment becomes null (e.g., user logs out, appointment cancelled),
    // ensure we can schedule a new one later by clearing the notificationScheduledRef.
    if (!recentAppointment) {
      notificationScheduledRef.current = null;
    }
  }, [recentAppointment]); // This effect runs only when recentAppointment changes
  useEffect(() => {
    // Request notification permissions and set up listeners
    const requestPermissions = async () => {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        console.warn('Failed to get push token for push notification! Please enable notifications in settings.');
        return;
      }
    };

    requestPermissions();

    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification tapped:', response);
    });

    // --- Function to check and schedule notification ---
    const checkAndScheduleNotification = async () => {
      const currentAppointment = latestAppointmentRef.current; // Get the latest appointment from ref

      // Only proceed if there's a current appointment and its notification hasn't been scheduled yet
      if (currentAppointment && notificationScheduledRef.current !== currentAppointment.id) {
        const { id, doctorName, date, timeSlot, drivingLink } = currentAppointment; // Destructure drivingLink

        const startTime = timeSlot.split('-')[0].trim(); // "6:00" from "6:00-7:00"
        const appointmentDateTimeString = `${date} ${startTime} AM`; // Assuming AM by default
        const appointmentDate = parse(appointmentDateTimeString, 'yyyy-MM-dd hh:mm a', new Date());

        if (isNaN(appointmentDate.getTime())) {
          console.error("Failed to parse appointment date/time:", appointmentDateTimeString);
          return;
        }

        const now = new Date();
        const hoursDifference = differenceInHours(appointmentDate, now);

        console.log(`Appointment for ${doctorName} on ${appointmentDateTimeString}. Hours difference: ${hoursDifference}`);

        // --- MODIFICATION START ---
        // Define the notification trigger time (1 hour and 20 minutes before appointment)
        const triggerBeforeMillis = (24 * 60 * 60 * 1000) + (50 * 60 * 1000); // 1 hour * 60 min * 60 sec * 1000 ms + 20 min * 60 sec * 1000 ms

        // Define the notification window for the 'hoursDifference' check.
        // We want to notify if the appointment is between 0 hours (now) and
        // approximately 2 hours away (to comfortably cover 1 hour 20 minutes).
        const notificationWindowStartHours = 0;
        const notificationWindowEndHours = 24; // Covers up to 2 hours away (e.g., 1h 20m falls within this)

        if (!isPast(appointmentDate, now) &&
            hoursDifference <= notificationWindowEndHours &&
            hoursDifference >= notificationWindowStartHours) {

          console.log(`Scheduling notification for ${doctorName} for appointment at ${appointmentDateTimeString}`);

          // Calculate exact trigger time: 1 hour 20 minutes before the appointment
          const triggerTime = new Date(appointmentDate.getTime() - triggerBeforeMillis);
          const finalTriggerDate = triggerTime > now ? triggerTime : new Date(now.getTime() + 5000);

          await Notifications.scheduleNotificationAsync({
            content: {
              title: "Upcoming Appointment Reminder!",
              // Updated body to reflect 1 hour 20 minutes
              body: `Your appointment with ${doctorName} is in less than 1 hour and 20 minutes, at ${timeSlot}. You can visit through this link: ${drivingLink}.`,
              data: { appointmentId: id, doctorName: doctorName, drivingLink: drivingLink }, // Also pass drivingLink in data
            },
            trigger: {
              date: finalTriggerDate, 
            },
          });
          notificationScheduledRef.current = id; 
          console.log("Notification scheduled successfully!");
        } else {
          console.log("Appointment not within desired notification window or already past.");
        }
       
      }
    };
    checkAndScheduleNotification();
    intervalIdRef.current = setInterval(checkAndScheduleNotification, 20 * 60 * 1000); // Check every 20 minutes

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current); // Clear the interval when component unmounts
        intervalIdRef.current = null;
      }
    };
  }, []); // Empty dependency array: this effect runs only once on mount

  return null; // This component doesn't render any UI
}
