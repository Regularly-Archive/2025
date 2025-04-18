# Umami Backend Service

This project is a backend service that retrieves site visit counts and visitor numbers from an Umami deployment. It is built using TypeScript and is designed to securely handle sensitive information by utilizing environment variables.

## Project Structure

```
umami-backend-service
├── api
│   └── stats.ts          # Contains the backend service logic
├── .env                  # Environment variables for sensitive data
├── .gitignore            # Files and directories to ignore by Git
├── package.json          # npm configuration file
├── tsconfig.json         # TypeScript configuration file
└── README.md             # Project documentation
```

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd umami-backend-service
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the root directory and add the following variables:
   ```
   UMAMI_USERNAME=your_username
   UMAMI_PASSWORD=your_password
   UMAMI_API_URL=https://umami.yuanpei.me/api/websites/445bd2eb-68f9-47fd-b93a-5dfa92be333d/stats
   ```

4. **Run the service:**
   ```bash
   npm start
   ```

## Usage

Once the service is running, you can access the endpoint to retrieve site visit counts and visitor numbers. Ensure that you have the correct credentials set in your `.env` file to authenticate with the Umami API.

## License

This project is licensed under the MIT License.