# Lablance

A blockchain-powered platform that connects companies with a global workforce for AI data labeling. Companies can get high-quality labeled data fast with instant payments using Solana blockchain technology.

## 🌟 Key Features

- **Two-sided Marketplace**: Connect companies needing data labeled with skilled labelers worldwide
- **Blockchain Payments**: Instant, secure payments via Solana's USDC tokens
- **Multiple Labeling Types**: Support for image classification, object detection, text annotation, and more
- **Real-time Progress Tracking**: Monitor project completion rates and spending
- **Quality Control**: Built-in verification mechanisms to ensure accurate labeling
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## 🛠️ Technologies Used

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Server Actions
- **Database**: PostgreSQL with Prisma ORM
- **Blockchain**: Solana Web3.js, Wallet Adapter
- **File Storage**: Digital Ocean Spaces (S3-compatible)
- **Authentication**: Wallet-based authentication

## 📁 Project Structure

- `/app`: Next.js app router pages and API routes
- `/components`: Reusable React components
- `/lib`: Utility functions and shared code
- `/prisma`: Database schema and migrations
- `/actions`: Server actions for handling form submissions
- `/public`: Static assets

## 🚀 Getting Started

### Prerequisites

- Node.js 22+ and npm/yarn
- PostgreSQL database
- Solana wallet (Phantom, Solflare, backpack etc.)
- Digital Ocean Spaces account (or any S3-compatible storage)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/0xgursharan/lablance.git
   cd ai-data-labeling-platform
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env` file based on the `.env.example` file and fill in your credentials.

4. Set up the database:
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## 🔐 Environment Variables

You'll need to set up the following environment variables:

```
# Database Connection
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# Digital Ocean Spaces Configuration
DO_SPACES_REGION="your-region"
DO_SPACES_ACCESS_KEY="your-access-key"
DO_SPACES_SECRET_KEY="your-secret-key"
DO_SPACES_BUCKET_NAME="your-bucket-name"

# Solana Configuration
NEXT_PUBLIC_SOLANA_CLUSTER="devnet" # or mainnet-beta for production
NEXT_PUBLIC_HELIUS_API_KEY="your-helius-api-key"
NEXT_PUBLIC_PLATFORM_WALLET="your-platform-wallet-address"
```

## 🔄 Workflow

### For Companies
1. Connect Solana wallet
2. Register company details
3. Create a project with labeling requirements
4. Upload sample data files
5. Fund the project with USDC
6. Monitor progress in real-time on the dashboard

### For Labelers
1. Connect Solana wallet
2. Register with skills and preferences
3. Browse available projects
4. Complete labeling tasks
5. Receive instant payments to wallet
6. Track earnings and performance

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with ❤️ for the global AI workforce