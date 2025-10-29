# Menuhaus: A Modern Restaurant Ordering Platform

> Menuhaus is a visually stunning and highly intuitive web application designed for modern restaurants. It provides a seamless digital dining experience, allowing customers to browse a beautifully categorized menu, view high-quality images and detailed descriptions of each dish, and effortlessly add items to a dynamic shopping cart. The platform features a streamlined, single-page checkout process for order confirmation and contact information collection. Built with a mobile-first philosophy, the interface is flawlessly responsive, ensuring an exceptional user experience on any device.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/yordanosalewond/restaurant-menu)

## Key Features

-   **Visually Stunning Menu:** Browse a beautiful, image-rich menu with detailed dish descriptions.
-   **Dynamic Category Filtering:** Easily filter menu items by categories like Appetizers, Entrees, Desserts, and Drinks.
-   **Interactive Shopping Cart:** A slide-in cart allows for easy review of selected items, quantity adjustments, and removal.
-   **Seamless Checkout:** A simple, single-page form to collect user details and confirm the order.
-   **State Persistence:** The shopping cart state is saved in `localStorage`, so users don't lose their selections on page refresh.
-   **Fully Responsive:** A mobile-first design that looks and works perfectly on desktops, tablets, and smartphones.
-   **Modern & Elegant UI:** A clean, minimalist aesthetic with smooth animations and micro-interactions to delight users.

## Technology Stack

-   **Frontend:** [React](https://react.dev/), [Vite](https://vitejs.dev/), [TypeScript](https://www.typescriptlang.org/)
-   **UI Framework:** [Tailwind CSS](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/) for components
-   **Backend:** [Hono](https://hono.dev/) running on [Cloudflare Workers](https://workers.cloudflare.com/)
-   **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)
-   **Data Persistence:** [Cloudflare Durable Objects](https://developers.cloudflare.com/durable-objects/)
-   **Routing:** [React Router](https://reactrouter.com/)
-   **Animations:** [Framer Motion](https://www.framer.com/motion/)
-   **Form Handling & Validation:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)

## Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later recommended)
-   [Bun](https://bun.sh/) package manager
-   [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) logged into your Cloudflare account.

```bash
# Install Wrangler globally
bun install -g wrangler

# Login to Cloudflare
wrangler login
```

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yordanosalewond/restaurant-menu.git
    cd restaurant-menu
    ```

2.  **Install dependencies:**
    This project uses Bun for package management.
    ```bash
    bun install
    ```

## Running the Project Locally

To start the development server, which includes the Vite frontend and the local Wrangler server for the backend API, run the following command:

```bash
bun run dev
```

This will start the application, typically on `http://localhost:3000`. The frontend will automatically proxy API requests to the local Cloudflare Worker instance.

## Project Structure

The project is organized into three main directories:

-   `src/`: Contains the entire React frontend application, including pages, components, hooks, and utility functions.
-   `worker/`: Contains the Hono backend application that runs on Cloudflare Workers. This is where API routes and Durable Object entity logic reside.
-   `shared/`: Contains TypeScript types and mock data that are shared between the frontend and the backend to ensure type safety.

## Deployment

This application is designed to be deployed to the Cloudflare global network.

1.  **Build the application:**
    This command bundles the React frontend and the Worker backend for production.
    ```bash
    bun run build
    ```

2.  **Deploy to Cloudflare:**
    Run the deploy command using Wrangler. This will publish your application to your Cloudflare account.
    ```bash
    bun run deploy
    ```

Alternatively, you can deploy your own version of this project with a single click.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/yordanosalewond/restaurant-menu)

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.