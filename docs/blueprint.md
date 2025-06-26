# **App Name**: Clemmont Irrigation Agent

## Core Features:

- Intent Recognition: Message parsing: Utilize a tool to parse user messages to extract intent (e.g., 'water plants', 'check status') and parameters (e.g., 'every day at 8am').
- Decision Making: State management: Based on the interpreted intent, this tool should decide on what information needs to be incorporated from available sensors.
- Chat UI: Display a chat-like interface to receive user commands and show Clemmont's responses.
- Quick Actions: Provide buttons for quick actions like manual watering and status check.
- Real-time Sensors: Show real-time data from sensors (humidity, water level, temperature).
- Firebase Connectivity: Connect to Firebase Realtime Database to read commands and write sensor data.
- Interface Translation (i18n): Enable users to switch between languages (Spanish/English) with all text, Clemmont's responses, and button labels translated.

## Style Guidelines:

- Primary color: Green (#7CB342), reflecting growth, nature, and freshness, to align with the gardening/irrigation app concept.
- Background color: Very light green (#F1F8E9), to create a calm, neutral backdrop that allows the primary color and content to stand out.
- Accent color: Light blue (#4FC3F7) to suggest water.
- Font pairing: 'Belleza' (sans-serif) for headlines, 'Alegreya' (serif) for body text. This pairing blends personality with readability for a friendlier appearance.
- Use line-based icons to represent sensors, watering actions, and other relevant functions, maintaining a clean and modern look.
- Adopt a simple, card-based layout to display sensor data, quick actions, and chat interface components in a well-organized manner.
- Implement subtle animations when data updates or actions are triggered to provide a sense of real-time feedback and liveliness.