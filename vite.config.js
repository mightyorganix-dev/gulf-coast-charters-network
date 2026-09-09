import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  base: "./",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        trips: resolve(__dirname, "trips.html"),
        trip: resolve(__dirname, "trip.html"),
        book: resolve(__dirname, "book.html"),
        captains: resolve(__dirname, "captains.html"),
        captain: resolve(__dirname, "captain.html"),
        captainPortal: resolve(__dirname, "captain-portal.html"),
        fleet: resolve(__dirname, "fleet.html"),
        admin: resolve(__dirname, "admin.html"),
        itinerary: resolve(__dirname, "itinerary.html"),
        about: resolve(__dirname, "about.html"),
        faq: resolve(__dirname, "faq.html"),
        whatToBring: resolve(__dirname, "what-to-bring.html"),
        safety: resolve(__dirname, "safety.html"),
        contact: resolve(__dirname, "contact.html"),
        reviews: resolve(__dirname, "reviews.html"),
        operators: resolve(__dirname, "operators.html"),
        operatorPacket: resolve(__dirname, "operator-packet.html"),
      },
    },
  },
});
