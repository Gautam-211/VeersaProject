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
  //
  // IMPORTANT: If 'Maximum update depth exceeded' still occurs with this code,
  // it strongly suggests that the 'recentAppointment' object itself (from useGlobalContext)
  // is being created as a NEW object reference on every render of its provider or parent component,
  // even if its internal data (like 'id') hasn't logically changed.
  // This causes this useEffect to trigger repeatedly, leading to the warning.
  // The internal logic of this NotificationScheduler (using useRef for setInterval) is already robust.
  // If the error persists, the root cause is typically in how 'recentAppointment'
  // is managed and updated by GlobalProvider or other components (e.g., PaymentSuccessScreen).
  useEffect(() => {
    latestAppointmentRef.current = recentAppointment;
    // If recentAppointment becomes null (e.g., user logs out, appointment cancelled),
    // ensure we can schedule a new one later by clearing the notificationScheduledRef.
    if (!recentAppointment) {
      notificationScheduledRef.current = null;
    }
  }, [recentAppointment]); // This effect runs only when recentAppointment changes

  // This useEffect sets up and clears the periodic check interval.
  // It runs only once on component mount and cleans up on unmount.
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

        // --- MODIFICATION START ---
        let amPm = 'AM';
        const hour = parseInt(startTime.split(':')[0], 10); // Extract hour part

        if (hour === 12) { // 12:00 is noon, so it's PM
          amPm = 'PM';
        } else if (hour >= 1 && hour <= 5) { // 1:00 to 5:00 are typically PM in 12-hour format
          amPm = 'PM';
        } else if (hour >= 6 && hour <= 11) { // 6:00 to 11:00 are AM
          amPm = 'AM';
        }
        // If the timeSlot string already contains AM/PM (e.g., "02:00 PM"),
        // we should try to use that directly for more robustness.
        // For simplicity, sticking to the explicit rule for now.
        // If timeSlot is like "6:00-7:00 PM", you'd need more complex parsing.
        // Based on your input "6:00-12:00 is set by the user then assume AM and after date of this assume PM like user book time 2:00-3:00 then assume PM"
        // This logic assumes `startTime` is always in `H:MM` or `HH:MM` format without AM/PM.

        const appointmentDateTimeString = `${date} ${startTime} ${amPm}`; // Dynamically append AM/PM
        const appointmentDate = parse(appointmentDateTimeString, 'yyyy-MM-dd hh:mm a', new Date());
        // --- MODIFICATION END ---

        if (isNaN(appointmentDate.getTime())) {
          console.error("Failed to parse appointment date/time:", appointmentDateTimeString);
          return;
        }

        const now = new Date();
        const hoursDifference = differenceInHours(appointmentDate, now);

        console.log(`Appointment for ${doctorName} on ${appointmentDateTimeString}. Hours difference: ${hoursDifference}`);

        // Define the notification trigger time (1 hour and 20 minutes before appointment)
        const triggerBeforeMillis = (1 * 60 * 60 * 1000) + (20 * 60 * 1000); // 1 hour * 60 min * 60 sec * 1000 ms + 20 min * 60 sec * 1000 ms

        // Define the notification window for the 'hoursDifference' check.
        // We want to notify if the appointment is between 0 hours (now) and
        // approximately 2 hours away (to comfortably cover 1 hour 20 minutes).
        const notificationWindowStartHours = 0;
        const notificationWindowEndHours = 2; // Covers up to 2 hours away (e.g., 1h 20m falls within this)

        if (!isPast(appointmentDate, now) &&
            hoursDifference <= notificationWindowEndHours &&
            hoursDifference >= notificationWindowStartHours) {

          console.log(`Scheduling notification for ${doctorName} for appointment at ${appointmentDateTimeString}`);

          // Calculate exact trigger time: 1 hour 20 minutes before the appointment
          const triggerTime = new Date(appointmentDate.getTime() - triggerBeforeMillis);

          // If the calculated trigger time is in the past (e.g., current time is 8:35 AM for a 10:00 AM appt,
          // and trigger should have been earlier than now), trigger the notification 5 seconds from now.
          const finalTriggerDate = triggerTime > now ? triggerTime : new Date(now.getTime() + 5000);

          await Notifications.scheduleNotificationAsync({
            content: {
              title: "Upcoming Appointment Reminder!",
              // Updated body to reflect 1 hour 20 minutes
              body: `Your appointment with ${doctorName} is in less than 1 hour, at ${timeSlot}. You can visit through this link: ${drivingLink}.`,
              data: { appointmentId: id, doctorName: doctorName, drivingLink: drivingLink }, // Also pass drivingLink in data
            },
            trigger: {
              date: finalTriggerDate,
            },
          });
          notificationScheduledRef.current = id; // Mark this appointment's notification as scheduled
          console.log("Notification scheduled successfully!");
        } else {
          console.log("Appointment not within desired notification window or already past.");
        }
      }
    };

    // Run the check immediately when this component mounts
    checkAndScheduleNotification();

    // Set up the interval to check every 20 minutes (20 * 60 * 1000 ms)
    // This ensures the check runs periodically to catch appointments entering the notification window.
    intervalIdRef.current = setInterval(checkAndScheduleNotification, 20 * 60 * 1000); // Check every 20 minutes

    // Cleanup function for this useEffect (runs on component unmount)
    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current); // Clear the interval when component unmounts
        intervalIdRef.current = null;
      }
    };
  }, []); 

  return null;
}
