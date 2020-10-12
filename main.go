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
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/favicon"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/helmet/v2"
	"wryteup.co/db"
	"wryteup.co/src/handler"

	_ "github.com/joho/godotenv/autoload"
	_ "github.com/lib/pq"

	// _ "github.com/golang-migrate/migrate/v4/source/file"
	jwtware "github.com/gofiber/jwt/v2"
	pg "wryteup.co/generated/db"
)

const (
	staticBuild = "./client/build"
	idxFile     = "./client/build/index.html"
	favIco      = "./client/public/favicon.ico"
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

	appDb := pg.New(conn)

	// load handlers
	h := handler.New(appDb)

	app.Static("/", staticBuild)

	// unprotected routes
	app.Post("/login", h.Login)
	app.Post("/signup", h.Signup)
	app.Get("/logout", h.Logout)

	// protected routes
	api := app.Group("/api/v1")
	api.Use(jwtware.New(jwtware.Config{
		SigningKey: []byte(os.Getenv("JWT_SIGNINGKEY")),
	}))
	api.Get("/bootstrap", h.BootstrapData)
	user := api.Group("/users")
	user.Post("/", h.Create)
	user.Get("/", h.UserList)
	user.Get("/:account_id", h.UserAccountId)

	writeup := api.Group("/writeups")
	writeup.Post("/", h.CreateWriteUp)
	writeup.Get("/", h.GetAllPublishedWriteups)
	writeup.Get("/all", h.GetAllWriteups)
	writeup.Get("/:slug_url", h.GetWriteupFromSlug)
	writeup.Get("/user/:user_id", h.GetAllWriteupsFromUser)

	// error handler
	app.Get("*", fallback)
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
			File: favIco,
		}),
		cors.New(cors.Config{
			AllowOrigins: "http://localhost:3000",
			AllowHeaders: "Origin, Content-Type, Accept, Authorization",
			AllowMethods: "GET,POST,HEAD,PUT,DELETE,PATCH",
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
	indexFile := idxFile
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
		DB_HOST     = os.Getenv("DB_HOST") // use the container name or network alias as the host to connect
		DB_NAME     = os.Getenv("POSTGRES_DB")
	)

	return fmt.Sprintf("postgres://%s:%s@%s:5432/%s?sslmode=disable", DB_USER, DB_PASSWORD, DB_HOST, DB_NAME)
}
