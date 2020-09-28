package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/compress"
	"github.com/gofiber/fiber/v2/middleware/favicon"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/helmet/v2"
	"wryteup.co/db"
	"wryteup.co/src/handler"

	_ "github.com/joho/godotenv/autoload"
	_ "github.com/lib/pq"

	// _ "github.com/golang-migrate/migrate/v4/source/file"
	pg "wryteup.co/generated/db"
)

const (
	migrationSource = "file://migrations"
)

func main() {
	// initialize app
	app := fiber.New(fiber.Config{
		Prefork: enabledPrefork(os.Getenv("ENABLED_PREFORK")),
	})

	// define middlewares
	initializeMiddlewares(app)

	// connect to database
	conn := &sql.DB{}
	var err error
	retries := 5
	for retries > 0 {
		conn, err = db.Connect(getDsn())
		if err != nil {
			log.Fatal(err)
			retries -= 1
			log.Printf("Retries remaining: %d \n", retries)
			time.Sleep(3 * time.Second) // wait for 3 seconds before reattempting
		}
		break
	}
	defer conn.Close()
	if err := conn.Ping(); err != nil {
		log.Fatalf("Cannot connect to Postgres Database: %v\n", err)
		os.Exit(-1)
	}

	log.Println("Successfully Connected to Database!")

	// instantiate repository
	appDb := pg.New(conn)

	// load handlers
	h := handler.New(appDb)

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

func getDsn() string {
	var (
		DB_USER     = os.Getenv("POSTGRES_USER")
		DB_PASSWORD = os.Getenv("POSTGRES_PASSWORD")
		DB_HOST     = "localhost" // use the container name as the host to connect
		DB_NAME     = os.Getenv("POSTGRES_DB")
	)

	return fmt.Sprintf("postgres://%s:%s@%s:5432/%s?sslmode=disable", DB_USER, DB_PASSWORD, DB_HOST, DB_NAME)
}

// func dbMigrate(conn *sql.DB) error {
// 	driver, err := postgres.WithInstance(conn, &postgres.Config{})
// 	if err != nil {
// 		return err
// 	}
// 	m, err := migrate.NewWithDatabaseInstance(
// 		migrationSource,
// 		"postgres",
// 		driver,
// 	)
// 	if err != nil {
// 		return err
// 	}
// 	return m.Steps(2)
// }
