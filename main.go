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
	"wryteup.co/src/handler"

	_ "github.com/joho/godotenv/autoload"
)

func main() {
	// initialize app
	app := fiber.New(fiber.Config{
		Prefork: enabledPrefork(os.Getenv("ENABLED_PREFORK")),
	})

	// define middlewares
	initializeMiddlewares(app)

	// load handlers
	h := handler.New()

	app.Static("/", "./client/build")

	// unprotected routes
	app.Post("/login", h.Login)
	app.Post("/signup", h.Signup)
	// protected routes
	api := app.Group("/api/v1")
	api.Get("/users", h.UserList)

	// error handler
	app.Get("/", fallback)
	app.Use(notFound)

	PORT := ":" + os.Getenv("APP_PORT")
	log.Fatal(app.Listen(PORT))
}

func initializeMiddlewares(app *fiber.App) *fiber.App {
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
	return app
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

func enabledPrefork(env string) bool {
	if env == "" {
		return false
	}

	if env == "true" {
		return true
	}

	return false
}
