# AI Receipt Reader 🧾

A simple and powerful AI-powered receipt scanner that extracts information from receipt images using Google's Gemini AI.

## Features ✨

- 📸 Upload receipt images (JPG, PNG, HEIC)
- 🤖 AI-powered data extraction using Google Gemini
- 💰 Automatically extracts: Amount, Date, Merchant, Category, Description
- 🎨 Clean and modern UI
- ⚡ Fast and easy to use

## Prerequisites 📋

Before you begin, ensure you have the following installed:
- **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** package manager (comes with Node.js)

## Setup Instructions 🚀

### 1. Clone the Repository

```bash
git clone https://github.com/vistanoop/genAi_receipt.git
cd genAi_receipt
```

### 2. Install Dependencies

```bash
npm install
```

Or if you prefer yarn:

```bash
yarn install
```

### 3. Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
GEMINI_API_KEY=your_api_key_here
```

Replace `your_api_key_here` with the API key you got from step 3.

### 5. Run the Application

Start the development server:

```bash
npm run dev
```

Or with yarn:

```bash
yarn dev
```

The application will be available at: **http://localhost:3000**

## Usage 📱

1. Open your browser and navigate to http://localhost:3000
2. Click on the "Scan Receipt with AI" button
3. Select a receipt image from your device
4. Wait for the AI to process the image (usually takes 2-5 seconds)
5. View the extracted information displayed on the screen

## Supported Image Formats 🖼️

- JPEG/JPG
- PNG
- HEIC
- Maximum file size: 5MB

## How It Works 🔧

1. **Frontend**: Built with Next.js 15 and React
2. **AI Processing**: Uses Google's Gemini 1.5 Flash model for image analysis
3. **Styling**: Tailwind CSS for a modern, responsive design
4. **UI Components**: Custom components built with Radix UI primitives

## Project Structure 📁

```
genAi_receipt/
├── app/
│   ├── api/
│   │   └── scan-receipt/
│   │       └── route.js          # API endpoint for receipt scanning
│   ├── globals.css               # Global styles
│   ├── layout.js                 # Root layout
│   └── page.js                   # Main page with receipt scanner UI
├── components/
│   └── ui/                       # Reusable UI components
├── .env.local                    # Environment variables (create this)
├── package.json                  # Dependencies
└── README.md                     # This file
```

## Troubleshooting 🔧

### "Failed to scan receipt" error
- Ensure your `GEMINI_API_KEY` is correctly set in `.env.local`
- Check that the API key is valid and has not expired
- Make sure the image is a clear receipt photo

### "File size should be less than 5MB" error
- Compress your image before uploading
- Use a different image format (JPEG usually has smaller file sizes)

### Port 3000 is already in use
```bash
# Use a different port
npm run dev -- -p 3001
```

## Production Build 🏗️

To create a production build:

```bash
npm run build
npm start
```

## Tech Stack 💻

- **Next.js 15** - React framework
- **React 19** - UI library
- **Google Gemini AI** - AI/ML processing
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible UI primitives
- **Lucide React** - Icons

## Contributing 🤝

Feel free to submit issues and enhancement requests!

## License 📄

This project is open source and available under the MIT License.

## Credits 💝

Created with ❤️ using Google Gemini AI

---

**Need help?** Open an issue on GitHub or check the [Google AI documentation](https://ai.google.dev/docs)
