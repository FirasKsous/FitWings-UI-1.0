## UI/UX Design Prompts for FitWings Fitness Coaching App (Part 1: Core App Structure, Navigation, and Theme Management)

**PWA Development (HTML, CSS, JavaScript):** This app will be developed as a Progressive Web App (PWA) using HTML, CSS, and JavaScript, ensuring cross-platform compatibility on iOS and Android devices. Mobile responsiveness is paramount.

**I. App Structure and Theme Management:**

1.  **Core App Structure:** The app will be structured around three primary sections: "Dashboard," "Workouts," and "Nutrition." These sections will be accessible through a fixed top tab navigation bar.

2.  **Theme Switching:**
    *   Implement a user-switchable theme option within the "Settings" section (accessible via a gear icon in the top right corner).
    *   **Dark Theme:**
        *   Background: Dark blue (#12182B), providing high contrast for white/light gray text.
        *   Accent Color: Glowing neon blue (#00A3FF) for interactive elements (buttons, icons, selected tabs, progress indicators).
        *   Text: White (#FFFFFF) or light gray (#EEEEEE) for readability.
        *   Card Background: Slightly darker blue (#1E2743) to provide visual separation.
        *   Active Tab Underline: Neon blue (#00A3FF).
        *   Button Backgrounds: Dark blue (#1E2743) with neon blue (#00A3FF) text on hover.
    *   **Light Theme:**
        *   Background: White (#FFFFFF).
        *   Accent Color: Neon blue (#00A3FF).
        *   Text: Dark blue (#12182B).
        *   Card Background: Light gray (#F5F5F5).
        *   Active Tab Underline: Neon blue (#00A3FF).
        *   Button Backgrounds: Light Gray (#F5F5F5) with dark blue (#12182B) text on hover.

3.  **Top Tab Navigation Bar:**
    *   **Fixed Position:** The navigation bar remains fixed at the top of the screen during scrolling.
    *   **Tab Elements:** Each tab displays a concise text label ("Dashboard," "Workouts," "Nutrition") with a corresponding icon.
        *   Dashboard Icon: A simple house or graph icon.
        *   Workouts Icon: A dumbbell or running figure icon.
        *   Nutrition Icon: An apple or fork and knife icon.
    *   **Active Tab Indication:** The active tab is visually distinguished by a neon blue underline and a slightly lighter background color in dark mode (and darker background color in light mode).
    *   **Smooth Transitions:** Implement smooth sliding transitions between tabs on tap/click.
    *   **Search Bar:** A search bar is located on the right side of the tab bar, allowing users to search workouts and other content within the app.

4.  **Settings Icon:** A gear icon is placed in the top right corner of the screen to access the Settings section, including theme switching.

5.  **Persistent Chat Input Area (Workout Tab Only):**
    *   **Position:** Fixed at the bottom of the screen on the "Workouts" tab.
    *   **Input Field:** Multiline text input field with a placeholder ("Type your message...").
    *   **Send Button:** A neon blue "Send" button (paper airplane icon) is positioned to the right of the input field.
    *   **Visual Separation:** A subtle dark blue (#1E2743) background in dark theme (and light gray in light theme) and a very subtle top border separate the chat input area from the main content.

**II. Mobile Responsiveness:**

*   All UI elements should adapt to different screen sizes and orientations (portrait and landscape) on mobile devices.
*   Use media queries in CSS to adjust layout, font sizes, and spacing as needed.
*   Ensure touch targets (buttons, icons) are large enough for comfortable interaction on touchscreens.

## UI/UX Design Prompts for FitWings Fitness Coaching App (Part 2: "Workout" Tab Layout - Main View - "My Plan")

**PWA Development (HTML, CSS, JavaScript):** This app will be developed as a Progressive Web App (PWA) using HTML, CSS, and JavaScript, ensuring cross-platform compatibility on iOS and Android devices. Mobile responsiveness is paramount.

**I. "Workout" Tab Layout (Main View - "My Plan"):**

1.  **Default View - "My Plan":** When the user selects the "Workout" tab, the default view is "My Plan," displaying assigned workouts for the current day/week.

2.  **Workout Cards (Visual Presentation):** Each assigned workout is presented as a card with rounded corners (8px radius).

    *   **Card Styling:**
        *   Dark Theme: Background #1E2743, subtle box shadow for depth.
        *   Light Theme: Background #F5F5F5, subtle box shadow.
        *   Padding: 16px padding inside each card.
    *   **Workout Name (Prominent Display):**
        *   Font: Gyrochrome (if available and appropriate; otherwise, a clean sans-serif font).
        *   Size: 18px, bold.
        *   Color: White in dark theme, dark blue in light theme.
        *   Placement: Top left corner of the card.
    *   **Representative Image/Icon (Visual Cue):**
        *   Size: 48x48px (adjust as needed for visual balance).
        *   Placement: Top right corner of the card.
        *   Type: Use vector icons or high-quality images related to the workout type (barbell, running figure, yoga pose, etc.). Use placeholder images if final assets are not available.
    *   **Concise Description (Expandable Functionality):**
        *   Font: Regular sans-serif, 14px.
        *   Color: Light gray in dark theme, dark gray in light theme.
        *   Placement: Below the workout name.
        *   Expansion: A small downward-pointing arrow icon (or "+" icon) appears at the bottom of the description area. Tapping it smoothly expands the description with a slide-down animation. Tapping it again collapses the description with a slide-up animation.
    *   **Estimated Workout Duration (Time Commitment):**
        *   Font: Regular sans-serif, 12px.
        *   Color: Light gray in dark theme, dark gray in light theme.
        *   Placement: Bottom left corner of the card.
        *   Icon: A small clock icon precedes the time.
    *   **Number of Exercises:**
        *   Font: Regular sans-serif, 12px.
        *   Color: Light gray in dark theme, dark gray in light theme.
        *   Placement: Bottom center of the card
        *   Icon: A small list icon precedes the number.
    *   **Workout Intensity (Visual Representation - Optional, if relevant):**
        *   Type: A progress bar that fills based on intensity (e.g., low, medium, high).
        *   Color: Neon blue for the progress bar fill.
        *   Placement: Below the description.
    *   **Targeted Muscle Groups (Highlighted Body Image - Optional):**
        *   Type: A stylized human body outline. Targeted muscle groups are highlighted in neon blue.
        *   Placement: Right side of the card, below the icon if there is one.

3.  **"Explore Workouts" Section (Access to Workout Library):**
    *   Button/Tab Label: "Explore Workouts" or "Workout Library".
    *   Styling: Standard button styling (dark blue background with neon blue text in dark theme, light gray background with dark blue text in light theme).
    *   Functionality: Tapping this navigates the user to a separate screen/section displaying all available workouts with search and filtering options (to be specified in a later prompt).

4.  **"Create Workout" Button (Custom Workout Creation):**
    *   Icon: A plus sign within a rounded square icon.
    *   Placement: Bottom right corner of the screen (fixed position).
    *   Styling: A floating action button (FAB) with a neon blue background and a white plus icon in dark theme (dark blue background and white plus icon in light theme). A subtle shadow effect is added to give it a sense of depth.
    *   Functionality: Tapping this opens the "Create Your Workout" modal (to be specified in a later prompt).

5. **Workout in Progress Pop-up:**
    *   Background: Semi-transparent dark overlay (RGB(0, 0, 0), alpha 0.5) to dim the background.
    *   Pop-up Card: Dark blue background (#1E2743) with rounded corners.
    *   Text: White.
    *   Buttons: "No, Keep Current" (Light gray background, dark blue text) and "Yes, Switch Workout" (Neon blue background, white text).
## UI/UX Design Prompts for FitWings Fitness Coaching App (Part 3: Workout Details Modal - Draggable Bottom Sheet)

**PWA Development (HTML, CSS, JavaScript):** This app will be developed as a Progressive Web App (PWA) using HTML, CSS, and JavaScript, ensuring cross-platform compatibility on iOS and Android devices. Mobile responsiveness is paramount.

**I. Workout Details Modal (Draggable Bottom Sheet):**

1.  **Modal Presentation and Behavior:**
    *   **Trigger:** Tapping a workout card in the "My Plan" view triggers the modal.
    *   **Animation:** Smooth slide-up animation from the bottom of the screen.
    *   **Background Scrim (Overlay):** A semi-transparent dark overlay (RGB(0, 0, 0), alpha 0.5) covers the background content while the modal is open, preventing interaction with the background.
    *   **Vertical Draggability:** The modal is vertically draggable.
        *   Dragging down past 30% of the screen height minimizes the modal to a floating button at the bottom center.
        *   Dragging up from the minimized button restores the modal.
    *   **Minimization to Bottom Button:**
        *   Button Styling: Neon blue background, white text (dark theme). Dark blue background, white text (light theme). Rounded corners.
        *   Content: Displays the workout's name and a running elapsed workout timer (format: MM:SS).
        *   Interaction: Tapping the minimized button restores the modal.
    *   **Background Interaction (Minimized State):** The user can interact with the "Workouts" tab content while the modal is minimized.
    *   **Workout Termination Confirmation:** If the user taps another workout card while a workout is active (modal open or minimized), a confirmation dialog appears:
        *   Dialog Background: Dark blue (#1E2743) in dark theme, light gray in light theme.
        *   Text: White in dark theme, dark blue in light theme.
        *   Buttons: "No, Keep Current" (light gray background, dark blue text) and "Yes, Switch Workout" (neon blue background, white text).
        *   Functionality: "No" cancels the workout switch. "Yes" closes the current workout modal/timer, opens the new workout’s modal and starts a new timer.

2.  **Modal Content and Structure:**
    *   **Rounded Corners:** The modal has rounded corners (16px radius).
    *   **Workout Header (Prominent Title):**
        *   Font: Gyrochrome (if available and appropriate; otherwise, a clean sans-serif font).
        *   Size: 20px, bold.
        *   Color: White in dark theme, dark blue in light theme.
        *   Placement: Top center of the modal.
    *   **Workout Progress Indicator (Animated Circular Progress):**
        *   Type: Circular progress bar.
        *   Color: Neon blue for the progress ring.
        *   Placement: To the left of the workout name.
        *   Animation: Smoothly updates as exercises are marked complete.
    *   **"Start Workout"/"Pause Workout" Button and Elapsed Timer:**
        *   Button Styling: Neon blue background, white text in dark theme. Dark blue background, white text in light theme. Rounded corners.
        *   Placement: To the right of the workout name.
        *   Functionality:
            *   "Start Workout": Changes button text to "Pause Workout," starts the elapsed timer (MM:SS format).
            *   "Pause Workout": Changes button text back to "Start Workout," pauses the timer. The timer persists even when the modal is minimized.
    *   **Warm-up Section (Conditional Display):**
        *   Heading: "Warm-up" (16px, bold, white/dark blue text).
        *   Content: Lists warm-up exercises with durations (e.g., "Dynamic Stretching - 3:00").
    *   **Exercise Tables/Cards (Detailed Exercise Information):** Displayed below the warm-up section or directly below the header if no warm-up is present (detailed in Part 4).

## UI/UX Design Prompts for FitWings Fitness Coaching App (Part 4: Detailed Exercise Table/Card Structure - Within the Modal)

**PWA Development (HTML, CSS, JavaScript):** This app will be developed as a Progressive Web App (PWA) using HTML, CSS, and JavaScript, ensuring cross-platform compatibility on iOS and Android devices. Mobile responsiveness is paramount.

**I. Detailed Exercise Table/Card Structure (Within the Modal):**

Each exercise within the workout is presented in a distinct card with rounded corners (8px radius).

1.  **Exercise Card Styling:**
    *   Dark Theme: Background #1E2743, subtle bottom border (#283454).
    *   Light Theme: Background #FFFFFF, subtle bottom border (#EEEEEE).
    *   Padding: 16px padding inside each card.

2.  **Exercise Name (Tappable for Video/Description):**
    *   Font: Bold sans-serif, 16px.
    *   Color: White in dark theme, dark blue in light theme.
    *   Placement: Top left of the card.
    *   Interaction: Tapping the name opens a separate modal (described in Part 6) with a video and detailed description.

3.  **Quick Exercise Instructions/Tips (Tooltip Functionality):**
    *   Icon: A circular "i" icon (information icon) next to the exercise name.
    *   Tooltip: A small pop-up appears on tap, displaying a brief description or key instructions.
        *   Tooltip Background: Dark gray (#333333) in dark theme, light gray in light theme.
        *   Text: White in dark theme, dark blue in light theme.
        *   Dismissal: Tapping anywhere outside the tooltip or after a short delay dismisses it.

4.  **Set Rows (Tracking Sets, Reps, Weight, and RPE):**
    *   Each set is displayed in its own row within the exercise card.

    *   **Set Row Structure:** Each row contains the following elements, arranged horizontally:
        *   **Set Number:** Displayed as "Set 1," "Set 2," etc. (14px, regular sans-serif, light gray/dark gray text).
        *   **Weight Input Field:** A numerical input field for weight (kg/lbs - user selectable unit in settings). A placeholder is displayed (e.g., "Weight").
        *   **Reps Input Field:** A numerical input field for repetitions. A placeholder is displayed (e.g., "Reps").
        *   **RPE Display Box:** A tappable box displaying the selected RPE value (or "RPE" if not yet selected).
        *   **"Done" Checkbox:** A checkbox at the end of the row.

    *   **Input Field Styling:**
        *   Background: Darker blue (#283454) in dark theme, light gray in light theme.
        *   Border: None.
        *   Text Color: White in dark theme, dark blue in light theme.

    *   **"Done" Checkbox Functionality:**
        *   On check: The entire row is covered with a semi-transparent dark blue overlay (RGB(0, 30, 170), alpha 0.5) and a subtle sound effect plays.
        *   On uncheck: The overlay is removed.

5. **"Generate Set" Button (Adding Sets):**
    *   Placement: Below the last set row.
    *   Styling: Small button with a "+" icon.
    *   Functionality: Adds a new set row below the existing ones, pre-filling weight and reps with the values from the previous set.

6.  **"X" Button (Deleting User-Generated Sets):**
    *   Placement: At the end of each set row (only for user-generated sets).
    *   Styling: Small "X" icon.
    *   Functionality: Deletes the corresponding set row. Initial sets (defined in the workout plan) cannot be deleted.

7.  **"Complete Exercise" Button (Marking Exercise Completion):**
    *   Placement: Below the set rows for each exercise.
    *   Styling: Neon blue background, white text in dark theme. Dark blue background, white text in light theme. Rounded corners.
    *   Functionality:
        *   On tap: The entire exercise card is covered with the same semi-transparent dark blue overlay as completed sets, and a sound effect plays. The button text changes to "Uncomplete Exercise".
        *   On tap again: The overlay is removed, and the button text changes back to "Complete Exercise".

## UI/UX Design Prompts for FitWings Fitness Coaching App (Part 5: RPE Selection and Rest Timer Functionality)

**PWA Development (HTML, CSS, JavaScript):** This app will be developed as a Progressive Web App (PWA) using HTML, CSS, and JavaScript, ensuring cross-platform compatibility on iOS and Android devices. Mobile responsiveness is paramount.

**I. RPE (Rate of Perceived Exertion) Selection Process:**

1.  **Triggering RPE Selection:** Tapping the RPE display box in a set row opens the RPE selection pop-up.

2.  **RPE Value Presentation (Within the Pop-up):**
    *   Pop-up Styling: Dark blue background (#1E2743) in dark theme, light gray in light theme. Rounded corners (8px).
    *   RPE Values: Presented as tappable buttons or list items.
        *   Text: White in dark theme, dark blue in light theme.
        *   Styling: Each RPE value has a distinct visual style (e.g., different background color or subtle border on hover).
    *   RPE Descriptions: Displayed below each RPE value in a smaller font size (12px, light gray/dark gray text).

    *   RPE Values and Descriptions:
        *   6 = "You could do 4 or more reps. RPE values under 6 are difficult to estimate accurately."
        *   6.5 = "You could perform 3-4 more reps before reaching failure."
        *   7 = "You could comfortably perform 3 more reps."
        *   7.5 = "You could perform 2-3 more reps before reaching failure."
        *   8 = "You could comfortably perform 2 more reps before failure."
        *   8.5 = "You could perform 1-2 more reps before reaching failure."
        *   9 = "You could comfortably perform 1 more rep before failure."
        *   9.5 = "You could possibly do 1 more rep before reaching failure."
        *   10 = "Maximum exertion. No more reps are possible."

3.  **RPE Value Selection and Pop-up Closure:**
    *   On tap: The selected RPE value is displayed in the RPE display box in the set row (e.g., "RPE 7").
    *   Animation: The pop-up smoothly closes or fades out.

**II. Rest Timer Functionality:**

1.  **Triggering the Rest Timer:** Checking the "Done" checkbox for a set row triggers the rest timer.

2.  **Rest Timer Display and Countdown:**
    *   Placement: A prominent timer display appears at the bottom of the modal bottom sheet.
    *   Styling: Large, bold font (e.g., 24px), neon blue text in dark theme, dark blue in light theme.
    *   Format: Countdown displayed in MM:SS format (e.g., 3:00, 2:59, 2:58...).
    *   Background: Semi-transparent dark overlay (RGB(0, 0, 0), alpha 0.3) behind the timer for better visibility.

3.  **Auditory Notification (Timer Completion):** A distinct, non-jarring sound effect plays when the timer reaches 0:00.

4.  **Timer Pausing and Resuming:**
    *   Pausing: Minimizing the app or navigating away from the workout screen pauses the timer.
    *   Resuming: Returning to the workout screen resumes the timer from the paused time.

5.  **Rest Timer Customization (User-Created Workouts Only):**
    *   Access: Tapping the timer display before it starts the countdown opens the customization options.
    *   Customization Options:
        *   Time Picker: A time picker UI element (e.g., a spinner or scrollable list) allows the user to set the rest time.
        *   Default Rest Time Setting (Alternative): A setting within the workout creation process allows setting a default rest time for the workout.

## UI/UX Design Prompts for FitWings Fitness Coaching App (Part 6: Exercise Details Modal - Video and Description)

**PWA Development (HTML, CSS, JavaScript):** This app will be developed as a Progressive Web App (PWA) using HTML, CSS, and JavaScript, ensuring cross-platform compatibility on iOS and Android devices. Mobile responsiveness is paramount.

**I. Exercise Details Modal (Video and Description):**

1.  **Triggering the Exercise Details Modal:** Tapping the exercise name within an exercise card (in the workout details modal) opens this modal.

2.  **Modal Presentation:**
    *   Presentation Style: A modal that overlays the entire screen (or the workout details modal if it is still open).
    *   Background Scrim: A semi-transparent dark overlay (RGB(0, 0, 0), alpha 0.7) covers the background content.
    *   Animation: Smooth fade-in animation for the modal appearance and fade-out animation for dismissal.

3.  **Modal Content and Structure:**

    *   **Exercise Video (If Available):**
        *   Placement: At the top of the modal.
        *   Video Player: A standard HTML5 video player with controls (play/pause, volume, fullscreen).
        *   Autoplay: The video autoplays if the user has this setting enabled in the app's settings; otherwise, a play button is prominently displayed.
        *   Placeholder: If no video is available, a relevant image or placeholder graphic is displayed.
    *   **Exercise Name:**
        *   Font: Bold sans-serif, 18px.
        *   Color: White in dark theme, dark blue in light theme.
        *   Placement: Below the video (or at the top if no video is present).
    *   **Exercise Description (Detailed Explanation):**
        *   Font: Regular sans-serif, 14px.
        *   Color: Light gray in dark theme, dark gray in light theme.
        *   Placement: Below the exercise name.
        *   Content: Detailed text explaining the proper form, technique, targeted muscles, and safety considerations.
    *   **Close Button (Modal Dismissal):**
        *   Placement: Top right corner of the modal.
        *   Icon: A clear "X" icon or "Close" text.
        *   Functionality: Tapping the close button dismisses the modal with a smooth fade-out animation.

**II. Styling Considerations:**

*   **Modal Background:** Dark blue (#1E2743) in dark theme, white in light theme.
*   **Rounded Corners:** The modal has rounded corners (16px radius).
*   **Scrolling:** If the content (video and description) exceeds the modal's height, vertical scrolling should be enabled.


## FitWings Fitness Coaching App - Workout Calendar Redesign (Part 1: Core Calendar Functionality, Workout Details, and Rescheduling)


**PWA Development (HTML, CSS, JavaScript):** This app will be a Progressive Web App (PWA) built with HTML, CSS, and JavaScript for cross-platform compatibility.

**Focus Areas:** Interactivity, gamification, responsiveness, user engagement, and accessibility.

**I. Interactive Calendar View (Progress Tracking):**

*   **Placement:** Below the "My Plan" section or in a dedicated "Progress" or "Calendar" tab.
*   **View Options:**
    *   **Weekly View (Default):** Shows individual days with workout indicators. Swipe horizontally to navigate weeks.
    *   **Monthly View:** Displays the overall schedule with workout statuses. Smooth transitions when switching months.
    *   **Yearly View (Optional - Post-MVP):** Heatmap display with intensity-based color coding for workout consistency.
*   **Navigation Controls:**
    *   Navigation arrows or a dropdown selector for month/year navigation.
    *   Swipe gestures on mobile.
    *   Smooth sliding animations between views.
*   **Workout Indicators:**
    *   **Completed Workouts:** Pulsating neon blue checkmark or glowing filled circle. Tooltip on hover/tap with workout name and completion status.
    *   **Assigned Workouts:** Lighter blue outline or dotted circle. "Incomplete" status icon if not completed by day's end.
    *   **Missed Workouts:** Subtle red outline or crossed-out icon, prompting rescheduling.

**II. Workout Details Pop-Up (from Calendar):**

*   **Content:** Workout name, assigned date/time, exercises, sets, reps, weights, RPE, and completion status. "Edit Workout" button for quick changes.
*   **Visual Design:** Clean, minimalist design with bold typography for workout names.
*   **Interactive Elements:** Swipe between multiple workouts assigned on the same day.
*   **Animations:** Smooth slide-up/fade-in on selection. Progress bar if partially completed.
*   **Interactive Charts (Optional - Post-MVP):** Mini progress visuals (pie charts or bar graphs) showing set/rep/exercise completion percentage.
*   **Action Buttons:**
    *   "Edit" Button: Opens workout in full edit mode with "Editing Workout" banner.
    *   "Log as Complete" Button: One-tap workout completion.

**III. Workout Rescheduling (Drag-and-Drop):**

*   **Drag Visual Feedback:** Workout shrinks slightly and becomes semi-transparent during drag. Target day highlighted with a glowing border.
*   **Conflict Handling:** Pop-up if dragging to a day with another workout:
    *   Option 1: Merge workouts.
    *   Option 2: Swap workouts.
*   **Undo Option:** "Undo" toast notification after rescheduling.
*   **"Reset Workout Splits" Button:** Above the calendar. Confirmation modal: “Are you sure you want to reset your workout schedule?”

**PWA Development (HTML, CSS, JavaScript):** This app will be a Progressive Web App (PWA) built with HTML, CSS, and JavaScript for cross-platform compatibility.

**Focus Areas:** Interactivity, gamification, responsiveness, user engagement, and accessibility.

**IV. Workout Cancellation and Adjustments:**

*   **Workout Cancellation (from Calendar):**
    *   "Cancel Workout" button in the workout details pop-up.
    *   Confirmation modal:
        *   Option 1: "Skip for Today" (tracks as skipped).
        *   Option 2: "Cancel Entirely" (removes from calendar and database).
*   **Adjusting Missed Workouts:**
    *   "Reschedule Missed Workouts" button to reschedule all missed workouts to future available days.
    *   Visual confirmation (glowing calendar days or notification banners).

**V. Advanced Features for Engagement and Personalization:**

*   **Customizable Calendar Themes:**
    *   Light Theme: Clean, pastel tones with soft shadows.
    *   Dark Theme: Neon highlights and subtle glows.
    *   "Personalize Theme" button in settings with real-time preview.
*   **AI-Powered Workout Suggestions:**
    *   "Smart Suggestions" section on empty days based on user plan and goals.
    *   Suggestions include workout type, duration, and intensity.
    *   Swipeable suggestions or "Generate Another" button.
*   **Insights and Progress Analytics:**
    *   Optional "Insights Panel" overlay on the calendar.
    *   Metrics: Total workouts completed, missed, and rescheduled.
    *   Bar or line charts for session frequency, intensity, or duration trends.
    *   Actionable insights (e.g., “You completed 80% of your workouts this week—great job!”).

**VI. Enhanced Interactivity and Animations:**

*   **Smooth Animations and Transitions:**
    *   Button press animations (scaling or ripples).
    *   Day hover/tap glows.
    *   Smooth slide animations between months/weeks.
*   **Dynamic Pop-Up Feedback:**
    *   Confirmation banners or toast notifications for actions (rescheduling, editing, completing). Example: “Workout successfully rescheduled to January 25th!”
*   **Haptic Feedback (Mobile):**
    *   Gentle vibrations for drag-and-drop, button presses, and streak milestones.

**VII. Accessibility and Responsiveness:**

*   **Accessibility Enhancements:**
    *   Voice Control: Calendar navigation and workout logging via voice commands (e.g., “Move my strength session to Friday.”).
    *   Keyboard Navigation: Full keyboard accessibility.
*   **Offline Functionality:**
    *   Offline viewing and modification of the calendar with automatic synchronization when online.
*   **Responsive Design:**
    *   Optimized for all screen sizes:
        *   Mobile: Larger tap areas and swipe gestures.
        *   Tablet/Desktop: Compact layouts with hover tooltips.

**VIII. Final Polish and Empty State Design:**

*   **Empty State Handling:**
    *   Engaging placeholders for days/weeks with no assigned workouts. Example: An illustration of a coach with the message, “Nothing planned here yet! Let’s get started with your next workout.” "Schedule Workout" button.
*   **Daily Overview Banner:**
    *   Summary banner at the top of the calendar for the current day’s activity. Example: “Today: 1 workout scheduled | 7-day streak ongoing!”
*   **Motivational Prompts:**
    *   Encouraging messages for missed workouts (e.g., “No worries! Let’s get back on track tomorrow.”).
*   **Gamification Features:**
    *   **Streak Tracking:** Streak tracker at the top of the calendar. Glowing effects for streak milestones. Motivational messages (e.g., “Keep it up! You’re on fire!”).
    *   **Badges and Rewards:** Badges for achievements (e.g., “Strength Master,” “Flexibility Star”). Display earned badges in a "Trophies Section".
## UI/UX Design Prompts for FitWings Fitness Coaching App - Nutrition Section (Part 1: Core Layout, Daily Overview, and Food Logging)


**PWA Development (HTML, CSS, JavaScript):** This app will be developed as a Progressive Web App (PWA) using HTML, CSS, and JavaScript, ensuring cross-platform compatibility on iOS and Android devices. Mobile responsiveness is paramount.

**I. Core Layout and Navigation:**

1.  **Tab Navigation:** The "Nutrition" tab is accessible from the main top navigation bar. It is a premium feature; non-premium users tapping it will see a modal prompting them to upgrade.

2.  **Daily Overview Screen:** This is the main screen within the "Nutrition" tab.

**II. Daily Overview Content:**

1.  **Date Selection:** A horizontal date picker at the top allows users to navigate between days. The current day is highlighted.

2.  **Calorie Tracking (Circular Progress Indicator):**
    *   A large circular progress indicator displays the daily calorie target and current intake.
    *   Center Text: Displays "Calories" and the current calorie count/target (e.g., "1850/2000").
    *   Progress Ring: The ring fills proportionally to the calorie intake relative to the target.
    *   Colors: Neon blue for the progress ring, white/dark blue for the text.

3.  **Macro Tracking (Pie Charts):**
    *   Three smaller pie charts are arranged horizontally below the calorie indicator, one for each macro (Protein, Carbs, Fat).
    *   Each pie chart displays the macro's current intake and target (in grams and percentage).
    *   Colors: Distinct, visually appealing colors for each macro (e.g., green for protein, yellow for carbs, orange for fat).

4.  **Meal Summary (Collapsible Sections):**
    *   Meals (Breakfast, Lunch, Dinner, Snacks) are displayed as collapsible sections below the macro charts.
    *   Each meal section has a header displaying the meal name and total calories/macros for that meal.
    *   Tapping the header expands/collapses the section to show the individual food items logged for that meal.
    *   Each logged food item displays its name, serving size, and calorie/macro breakdown.

5. **AI Suggested Meals and Ingredients:**
    *   AI-suggested meals are displayed prominently above the "Log Food" section, separated by a clear visual divider (a slightly thicker line with a subtle glow in the dark theme).
    *   Each suggested meal displays its name, a representative image, and a brief nutritional summary (calories and key macros).
    *   A button or icon (e.g., a plus sign) allows the user to quickly log the entire suggested meal.
    *   Suggested ingredients are displayed below each suggested meal, allowing the user to log individual components if desired. These are clearly marked as AI suggested.

6.  **"Log Food" Button:** A prominent button at the bottom of the screen opens the food logging interface.

**III. Food Logging Interface:**

1.  **Search Bar:** A prominent search bar at the top with autocomplete functionality.

2.  **Barcode Scanner Integration:** A button or icon to activate the device's camera for barcode scanning.

3.  **Recent/Frequent Foods List:** Displays a list of recently or frequently logged foods for quick access.

4.  **Food Item Display (Search Results and Recent/Frequent Foods):**
    *   Food Name
    *   Serving Size Options (e.g., grams, ounces, cups)
    *   Calories per serving

5.  **Serving Size Selection:** A dropdown menu or input field to select the serving size.

6.  **Logging Confirmation:** A button or icon to confirm logging the food.

7. **Visual Distinction Between Logged Food and AI Suggestions:** Logged food items are displayed in a visually distinct way from AI-suggested meals and ingredients. This could be achieved using different background colors, icons, or text styles. For Example: Logged food items have a light background while AI suggestions have a slightly darker one.

**IV. Theme Application:** Apply the specified dark and light theme colors and styles to all elements in this section.


## UI/UX Design Prompts for FitWings Fitness Coaching App - Nutrition Section (Part 2: Visualizations, Recipe Logging, Water Tracking, and Personalized Feedback)


**PWA Development (HTML, CSS, JavaScript):** This app will be developed as a Progressive Web App (PWA) using HTML, CSS, and JavaScript, ensuring cross-platform compatibility on iOS and Android devices. Mobile responsiveness is paramount.

**I. Visualizations:**

1.  **Daily Macro Tracking (Circular Progress Animation Graph):**
    *   Placement: Below the daily calorie circular progress indicator.
    *   Structure: Three smaller circular progress graphs arranged horizontally, one for each macro (Protein, Carbs, Fat).
    *   Display: Each graph shows the current macro intake and target (in grams and percentage). The percentage is displayed in the center of the circle.
    *   Animation: The progress rings fill smoothly as the user logs food.
    *   Colors:
        *   Protein: Green (#4CAF50).
        *   Carbs: Yellow (#FFEB3B).
        *   Fat: Orange (#FF9800).
        *   Background circle: A slightly darker shade of the background color (dark blue/light gray).

2.  **Macro Distribution (Pie Charts - Within Meal Sections):**
    *   Placement: Within each meal section (Breakfast, Lunch, Dinner, Snacks), a small pie chart shows the macro distribution for that meal.
    *   Display: The pie chart segments represent the percentage of calories from each macro.
    *   Colors: Same macro colors as the daily tracking graphs (green, yellow, orange).

3.  **Weekly/Monthly Trends (Line Graphs - Separate "Progress" View):**
    *   Access: A separate "Progress" view (accessible via a button or tab within the Nutrition section) displays weekly and monthly trends.
    *   Data Displayed: Line graphs showing trends in calorie intake, protein intake, carb intake, and fat intake over the selected time period.
    *   Interactive Elements: Users can tap on data points on the graph to see specific values for that day.
    *   Time Period Selection: Buttons or a dropdown menu to switch between weekly and monthly views.

**II. Recipe Logging:**

1.  **Access:** A button or link within the "Log Food" interface labeled "Create Recipe" or similar.

2.  **Recipe Creation Interface:**
    *   Recipe Name Input: Text input field for the recipe name.
    *   Ingredient Input Fields: Multiple input fields for ingredients (with autocomplete functionality).
    *   Serving Size Input: Input field for the number of servings the recipe makes.
    *   Nutritional Information Calculation: The app automatically calculates the nutritional information per serving based on the entered ingredients.
    *   Save Recipe Button: Saves the custom recipe to the user's recipe library.

3.  **Recipe Library:** A section to view, edit, and delete saved recipes.

4.  **Logging Recipes:** Users can log their custom recipes in the same way they log other food items.

**III. Water Tracking:**

1.  **Water Tracking Display:** A simple display on the daily overview screen showing the user's current water intake and daily target (e.g., "1.5L / 2L").

2.  **"Add Water" Button:** A button or icon (e.g., a water droplet) to add water intake.

3.  **Input Method:** A simple input method to select the amount of water consumed (e.g., a dropdown with common serving sizes or a numerical input).

**IV. Personalized Feedback (MVP Examples):**

1.  **Macro Target Achievement:** "Great job hitting your protein target today!" or "You're getting close to your carb target!"

2.  **Consistent Logging:** "Keep up the great work logging your meals! Consistency is key."

3.  **Calorie Surplus/Deficit (Simple Feedback):** "You're in a slight calorie deficit today, which can contribute to weight loss." (Only provide very basic feedback on calorie balance in the MVP, avoid any medical advice)

4.  **Meal Timing (Optional):** "You're consistently having a high-protein breakfast, which is great for starting your day!" (If meal timing analysis is implemented).

**V. Theme Application:** Apply the specified dark and light theme colors and styles to all elements in this section.


## UI/UX Design Prompts for FitWings Fitness Coaching App - Nutrition Section (Part 3: Advanced Features, User Experience Enhancements, and Final Details)


**PWA Development (HTML, CSS, JavaScript):** This app will be developed as a Progressive Web App (PWA) using HTML, CSS, and JavaScript, ensuring cross-platform compatibility on iOS and Android devices. Mobile responsiveness is paramount.

**I. Advanced Features (MVP(AI ONLY) AND POST-MVP Considerations):**

1.  **Advanced Meal Planning:**
    *   AI-powered meal plan generation based on user preferences, dietary restrictions, and fitness goals.
    *   Recipe database with filtering and search options.
    *   Meal swapping within generated meal plans.
    *   Grocery list generation based on the selected meal plan.

2.  **Micronutrient Tracking:** Tracking of vitamins and minerals.

3.  **Integration with Fitness Trackers:** Syncing data with fitness trackers and other health apps.

4.  **Customizable Macro Targets:** Allowing users to manually adjust their macro targets.

**II. User Experience Enhancements:**

1.  **Smooth Animations and Transitions:** Implement smooth animations and transitions throughout the Nutrition section for a polished user experience. Examples:
    *   Smooth transitions between screens and modals.
    *   Smooth expansion/collapse animations for meal sections.
    *   Smooth updates for progress bars and pie charts.
    *   Subtle animations for button taps and other interactions.

2.  **Haptic Feedback:** Use haptic feedback (vibrations) for key interactions (e.g., logging food, completing a meal, hitting a target).

3.  **Empty State Handling:** Design appropriate screens for empty states (e.g., no food logged for the day, no recent foods). These screens should provide clear instructions or suggestions to the user.

4.  **Error Handling:** Implement robust error handling to prevent crashes and provide informative messages to the user in case of errors (e.g., network errors, invalid input).

5. **Visual Distinction Between Logged Food and AI Suggestions:** Use distinct visual cues to differentiate logged food items from AI-suggested meals and ingredients. This could involve different background colors, icons, fonts, or separators. For example:
    *   Logged food items could have a slightly lighter background color than AI suggestions.
    *   A small icon (e.g., a checkmark for logged items, a lightbulb for suggestions) could be used next to each item.
    *   A clear section header could be used to separate "Logged Food" from "AI Suggestions."

**III. Final Details and Polish:**

1.  **Consistent Styling and Branding:** Maintain consistent styling throughout the app, adhering to the dark/light themes and using the Gyrochrome font where appropriate.

2.  **Responsiveness and Adaptability:** Ensure the UI adapts well to different screen sizes and orientations.

3.  **Accessibility:** Follow accessibility guidelines (WCAG) to make the app usable for everyone.

4.  **Onboarding and Tutorials:** Consider adding onboarding screens or tooltips to guide new users through the Nutrition section's features.

5.  **Personalized Feedback (More Examples):**

    *   **Macro Balance:** "Your macro distribution is well-balanced today!" or "You might want to increase your protein intake."
    *   **Calorie Trends:** "You've been consistently in a calorie deficit this week. Keep up the good work!" or "You've been eating more calories than usual this week. Consider adjusting your intake if you're not seeing the desired results."
    *   **Meal Timing (Advanced):** "Eating more protein in your breakfast can help you feel fuller for longer." or "Spreading your carbohydrate intake throughout the day can help stabilize your blood sugar levels." (Only provide very basic feedback on calorie balance in the MVP, avoid any medical advice)

This completes the detailed UI/UX design prompts for the Nutrition section.


**VI. Final Details and Enhancements:**


*   **Animations and Transitions:** Use smooth animations and transitions throughout the app for a polished user experience (e.g., modal openings/closings, tab transitions, progress bar updates).
*   **Sound Effects:** Use subtle sound effects for key interactions (e.g., set completion, workout completion).
*   **Empty State Handling:** Design appropriate screens for empty states (e.g., no workouts assigned, no workouts found in search).
*   **Error Handling:** Implement robust error handling to prevent crashes and provide informative messages to the user.
*   **Accessibility:** Ensure the app is accessible to users with disabilities by following accessibility guidelines (WCAG).
## FitWings Fitness Coaching App - Progress Tracking Section Redesign (Part 1)

**PWA Development (HTML, CSS, JavaScript):** This section is designed for a PWA using HTML, CSS, and JavaScript, ensuring cross-platform compatibility and mobile responsiveness.

**Focus Areas:** Data visualization, user engagement, motivational design, clear, actionable insights, seamless user interaction, gamification, and AI-driven insights.

**I. Core Progress Tracking Overview:**

*   **Navigation and Layout:**
    *   Accessible via a "Progress" tab in the main navigation bar (consistent app-wide).
    *   Tabbed navigation (or scrollable layout on smaller screens) to organize content into:
        *   "Strength Progress"
        *   "Weight Progress (Fat Loss Tracking)"
        *   "Activity Summary"
    *   **Mobile Navigation:** Carousel-like swipe gestures for smooth transitions between sections.
*   **Dynamic Header Section:**
    *   Motivational banner at the top dynamically updates based on recent activity (e.g., "Great job completing 5 workouts this week!", "Set a new personal best today!").
    *   **Streak Tracker:** Displays consecutive workout days (e.g., "7-Day Streak 🔥"). Uses a flame emoji or similar visual cue to represent the streak.

**II. Strength Progress Visualization:**

*   **1. Interactive Exercise Cards:**
    *   **Design:**
        *   Rounded corners (8px radius).
        *   Subtle shadow effect (more pronounced in dark mode).
        *   Adaptive backgrounds: Darker blue (#1E2743) in dark mode, light gray (#F5F5F5) in light mode.
    *   **Main Elements:**
        *   **Exercise Name:** Bold, prominent using the app's main heading font (Gyrochrome or a similar clean sans-serif font).
        *   **Progress Icon:** A small upward arrow (neon blue in dark mode, dark blue in light mode) or upward bar shows if progress has been made. A subtle glow animation can also be used.
        *   **Mini Graph:** A compact line graph for quick progress insights.
    *   **User Interaction (Card Expansion):**
        *   Tap to Expand: Smooth expansion with a spring animation.
        *   **Expanded View:**
            *   **Detailed Graph:** Larger line graph with toggleable metrics (weight/reps). Different colors for different sets can be used.
                *   X-axis: Workout dates (formatted concisely, e.g., "Jan 10," "Jan 15").
                *   Y-axis: Weight (kg/lbs - user-selectable in app settings).
                *   Graph Line: Neon blue in dark mode, dark blue in light mode with smooth animations for updates.
                *   Data Points: Interactive dots reveal details on hover (desktop) or tap (mobile) using tooltips.
            *   **Set-by-Set Breakdown:** Collapsible table below the graph showing dates, weights, and reps for each set (sortable by date).
            *   **Compare Feature:** Toggleable side-by-side comparison of first and most recent workouts, highlighting changes in weight and reps.
            *   "Collapse" button or tap gesture to close the expanded view.
*   **2. Progress Calculation and Display:**
    *   Progress is considered when:
        *   Reps increase with the same weight.
        *   Weight increases with the same or more reps.
*   **3. Gamified Feedback:**
    *   **Progress Rewards (Points System):** Points awarded based on weight increases and exercise difficulty (pre-defined). Display point gain in a small animated pop-up notification after workout logging.
    *   **Congratulatory Messages:** Displayed below the progress graph or in a toast notification (e.g., "New Personal Best!", "You're Crushing It!", "Level Up!").
    *   **Motivational Quotes:** Displayed randomly on the main Strength Progress screen or within expanded exercise cards.
    *   **Social Sharing:** "Share Your Progress" button generates a shareable graphic with:
        *   Stylized progress graph.
        *   Customizable congratulatory caption (e.g., "Crushed my PB today!").
        *   Social media platform buttons (Facebook, Instagram, Twitter).

**III. Weight Progress (Fat Loss Tracking):**

*   **1. Weight Input Section:**
    *   Clear header ("Track Your Weight").
    *   **Input Fields:**
        *   Numerical input for weight (kg/lbs selectable via dropdown).
        *   Date input (defaults to today).
    *   "Save Weight" button with a glowing confirmation checkmark animation.
*   **2. Weight Tracking Graph:**
    *   Line graph displaying weight over time with selectable time ranges (last week, last month, custom range using a date range picker).
    *   X-axis: Time.
    *   Y-axis: Weight (kg/lbs).
    *   Visual Cues: Clear markers for data points. Trend lines and average weight change indicators (e.g., "Average loss: 0.5kg/week").
*   **3. Body Recomposition Feedback:**
    *   Non-intrusive banner or pop-up notification ("Body Recomposition Detected: You're gaining strength while maintaining weight!").
    *   Brief, informative explanation (avoiding medical advice).

## FitWings Fitness Coaching App - Progress Tracking Section Redesign (Part 2)

**PWA Development (HTML, CSS, JavaScript):** This section is designed for a PWA using HTML, CSS, and JavaScript, ensuring cross-platform compatibility and mobile responsiveness.

**Focus Areas:** Data visualization, user engagement, motivational design, clear, actionable insights, seamless user interaction, gamification, and AI-driven insights.

**IV. Overall Activity Tracking:**

*   **1. Completed Workouts:**
    *   Display: Total number of completed workouts.
    *   **Visual Representation:**
        *   **Progress Bar Visualization:** Horizontal progress bar showing progress towards a weekly or monthly workout goal (if set by the user). Example: "4/5 workouts completed this week!" with the bar filling dynamically after each logged workout.
        *   **Calendar Heatmap:** Compact heatmap displaying workout frequency over the past few weeks or months. Color intensity (light blue to darker blue) represents workout frequency. Hovering or tapping on a date shows the workout type and duration.
*   **2. Exercise Execution Tracking:**
    *   **Key Metrics:**
        *   Total Execution Count: Total times each exercise has been performed.
        *   Reps and Weight Totals: Sum of all reps and total weight moved for each exercise.
    *   **Visual Representations:**
        *   **Option 1 - Table View:** Sortable table listing each exercise, total execution count, total reps, and total weight moved. Tapping an exercise redirects to its detailed progress page (Strength Progress section).
        *   **Option 2 - Bar Charts:** Horizontal bar charts where each bar represents an exercise, and bar length reflects execution frequency or total weight moved. Color-coded bars (e.g., squats = orange, bench press = green).
*   **3. Interactivity and Gamification:**
    *   **Interactive Highlights:** Most frequently performed exercises are highlighted with glowing borders or bold labels.
    *   **Motivational Streaks:** “Consistency Champion” badge awarded for hitting streaks (e.g., squats 3x/week for a month).

**V. Progress Summary:**

*   **1. Progress Summary Access:** Prominent “View Progress Summary” button at the top of the Progress Section. Opens a pop-up modal or dedicated page.
*   **2. Summary Modal Layout:**
    *   **Header:** Displays the selected date range (default is last month) with a customizable date range picker. Predefined ranges: Last Week, Last Month, Last 3 Months, Last 6 Months, Last Year. Smooth transition animation when opening and closing the modal.
    *   **Summary Sections (Dynamic Based on Selected Date Range):**
        *   **Strength Progress:**
            *   Total weight lifted across all exercises.
            *   Number of new personal bests achieved.
            *   Average weekly increase in weight or reps per exercise.
            *   **Visualization:** Mini bar or line graph showing cumulative weight lifted over time.
        *   **Weight Progress:**
            *   Total weight change (gain or loss).
            *   Average weight change per week.
            *   **Graphical Representation:** The same weight tracking graph as the Weight Progress section, zoomed to the selected range.
        *   **Activity Summary:**
            *   Total number of workouts completed.
            *   Average workout frequency per week.
            *   **Visualization:** Bar chart showing workouts completed per week/month within the selected range.
    *   **Presentation:** Clear headings, concise text, and visually appealing charts and graphs. Smooth transition animations between different summary sections within the modal.

**VI. Theme Application, Visual Design, and Animations (Across All Progress Sections):**

*   **1. Theme Application:** Consistent application of the app's dark and light themes (as previously defined).
*   **2. Animations and Microinteractions:**
    *   Smooth transitions between tabs/sections and modal openings/closings.
    *   Smooth animations for graph updates and data changes.
    *   Subtle hover/tap animations for interactive elements.
    *   Progress bars fill smoothly upon completing workouts or saving data.
    *   Animations for point gains (e.g., numbers counting up, small pop-up notifications).
*   **3. Empty States:** Motivational empty state screens with cheerful illustrations and motivational text (e.g., "Your progress journey starts here! Log your first workout today."). Call-to-action button (e.g., “Log Workout” or “Track Weight”).

**VII. Accessibility Features (Across All Progress Sections):**

*   Alternative text for all visual elements.
*   Sufficient color contrast.
*   Keyboard and screen-reader-friendly navigation.

**VIII. Final Motivational Features (Across All Progress Sections):**

*   **1. Personalized Insights (AI-Driven):** Weekly or monthly insights (e.g., “You’re lifting 20% heavier on average compared to last month!”, “You’re consistently working out 4 times a week—keep up the great work!”). Delivered via banner notifications or pop-ups.
*   **2. Gamified Rewards (Leveling System):** XP gained for logging workouts, hitting personal bests, and maintaining streaks. Visual level progress (e.g., a glowing XP bar).
*   **3. Social Sharing (Enhanced):** Stylized visuals summarizing user progress (total weight lifted, workouts completed, strength milestones). Pre-filled, customizable captions (e.g., "I crushed it this month! 💪 Total weight lifted: 2,000 kg. #FitWings").


## FitWings Fitness Coaching App - Progress Tracking Section Redesign (Part 3)

**PWA Development (HTML, CSS, JavaScript):** This section is designed for a PWA using HTML, CSS, and JavaScript, ensuring cross-platform compatibility and mobile responsiveness.

**Focus Areas:** Data visualization, user engagement, motivational design, clear, actionable insights, seamless user interaction, gamification, and AI-driven insights.

This part focuses on tying everything together, adding final polish, and ensuring a cohesive user experience.

**IX. Connecting Progress with Other App Sections:**

*   **Workout Logging Integration:** Ensure seamless integration between the workout logging process and the Progress Tracking section. When a user logs a workout, the relevant data (weight, reps, sets, date) should be automatically updated in the Strength Progress and Overall Activity sections.
*   **Weight Input Integration:** Similarly, when a user inputs their weight, the Weight Progress graph should update dynamically.
*   **Motivational Feedback Triggering:** The motivational messages, points system, and social sharing features should be triggered automatically based on user actions (e.g., logging a new personal best, completing a workout streak).

**X. Visual Consistency and Branding:**

*   **Consistent Design Language:** Maintain a consistent design language across all sections of the app, including the Progress Tracking section. This includes using the same fonts, colors, spacing, and UI elements.
*   **Branding:** Incorporate the app's branding elements (logo, color scheme, typography) into the Progress Tracking section.
*   **Theme Consistency:** Ensure the dark and light themes are applied consistently to all elements, maintaining appropriate contrast and readability.

**XI. Testing and Refinement:**

*   **User Testing:** Conduct user testing to gather feedback on the usability and effectiveness of the Progress Tracking section.
*   **Iterative Refinement:** Based on user feedback, iterate on the design and functionality to improve the user experience.
*   **Performance Optimization:** Optimize the performance of the Progress Tracking section to ensure smooth animations and fast loading times, even with large amounts of data.

**XII. Specific UI/UX Details and Examples:**

*   **Example of Progress Card (Strength):**
    *   Exercise Name: "Barbell Squat" (Bold, Gyrochrome font).
    *   Progress Icon: Upward-pointing neon blue arrow with a subtle glow.
    *   Mini Graph: A small line graph showing a steady increase in weight over the past few weeks.
    *   "See More" button or tap area to expand.
*   **Example of Expanded Exercise View:**
    *   Larger graph with interactive data points.
    *   Data Table:
        | Date     | Set | Weight (kg) | Reps |
        | -------- | --- | ----------- | ---- |
        | Jan 10   | 1   | 80          | 8    |
        | Jan 10   | 2   | 80          | 8    |
        | Jan 15   | 1   | 85          | 8    |
        | Jan 15   | 2   | 85          | 8    |
*   **Example of Motivational Message:** "Congratulations! You've increased your bench press by 5kg this month! Keep pushing!" (Displayed in a toast notification with a checkmark icon).
*   **Example of Social Sharing Graphic:** A stylized graph showing the user's progress on a specific exercise, with a pre-filled caption: "Just hit a new personal best on my deadlift! 120kg! #FitWings #Progress"
*   **Example of Empty State:** An illustration of a weight with the text "Start tracking your workouts to see your progress here!" and a "Log Workout" button.

**XIII. Detailed Animation Examples:**

*   **Card Expansion:** The card smoothly expands upwards, pushing other content down. The graph within the card animates to its larger size.
*   **Progress Bar Update:** The progress bar fills smoothly with a subtle easing animation.
*   **Data Point Hover/Tap:** A tooltip smoothly fades in, displaying the data point's value.
*   **Points Gain Notification:** A small pop-up notification with the number of points gained animates in from the top right corner and then fades out after a short delay.

These detailed examples should give the AI coder a very clear understanding of the desired UI/UX.
