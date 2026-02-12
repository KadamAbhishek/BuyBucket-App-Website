# Buy Bucket App Website

This is a modern, responsive landing page for the Buy Bucket Android App.

## Project Structure

- `index.html`: The main HTML file containing the website content.
- `style.css`: All the styling for the website, including the orange theme and animations.
- `script.js`: JavaScript for the mobile menu, smooth scrolling, and scroll animations.
- `assets/`: Folder for your images and other assets.

## How to Customize

1. **Upload App Screenshots**:
   - Save your app screenshots into the `assets` folder with the following names:
     - `dashboard.jpg` (Dashboard view)
     - `swipe_actions.jpg` (List view with swipe actions)
     - `select_icon.jpg` (Icon selection dialog)
     - `reminders.jpg` (Reminders dialog)
     - `reminders.jpg` (Reminders dialog)
     - `settings.jpg` (Settings screen)
   - Save your app logo as `logo.png` in the `assets` folder.
   - Save your logo animation as `logo.gif` in the `assets` folder.
   - The website is already configured to display these images.
   - For best results, use screenshots with a consistent aspect ratio (portrait).

2. **Update Links**:
   - In the `download-cta` section, update the Play Store link when your app is published.
   - Currently, it is set to a disabled state. Remove the `disabled` class when ready.

3. **Colors**:
   - You can change the primary color in `style.css` by editing the `--primary-color` variable at the top of the file.

## How to Run

Simply open `index.html` in your web browser.

For a better experience (especially with future updates), you can run a local server:
- If you have Python: `python -m http.server`
- If you have Node.js: `npx serve`
