package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/compress"
	"github.com/gofiber/fiber/v2/middleware/favicon"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/helmet/v2"

	_ "github.com/joho/godotenv/autoload"
)

func main() {
	// initialize app
	app := fiber.New()

	// define middlewares
	app.Use(
		compress.New(compress.Config{
			Level: compress.LevelBestSpeed,
		}),
		logger.New(logger.Config{
			Format:     "[${time}] ${status} - ${method} ${path}\n",
			TimeFormat: "02-Jan-2006",
			TimeZone:   "Local",
			Output:     os.Stdout,
		}),
		favicon.New(favicon.Config{
			File: "./client/public/favicon.ico",
		}),
		helmet.New(),
	)
	app.Static("/", "./client/build")

	// routes

	// error handler
	app.Get("/", fallback)
	app.Use(notFound)

	PORT := ":" + os.Getenv("APP_PORT")
	log.Fatal(app.Listen(PORT))
}

func notFound(c *fiber.Ctx) error {
	if err := c.Status(http.StatusNotFound).SendFile("./client/404/404.html"); err != nil {
		return c.SendStatus(http.StatusNotFound)
	}
	return c.Next()
}

// render index.html when hitting / route.
func fallback(c *fiber.Ctx) error {
	indexFile := "./client/build/index.html"
	return c.SendFile(indexFile)
}
