---
---

---

# Jephy-MVC Documentation

## Overview

**Jephy-MVC** is a lightweight, modular PHP MVC framework built for developers who want clean architecture, high performance, and full control over their web applications. It follows the **Model-View-Controller** pattern to separate business logic, presentation, and data handling—making your code more maintainable, scalable, and testable.

> **Template Engine:** Unlike many lightweight frameworks that rely on raw PHP in views, Jephy-MVC natively integrates the **Smarty Engine**—a powerful, feature-rich template system that keeps your presentation layer clean, secure, and easy to manage.

---

## Key Features

- **Modular MVC Structure** – Clear separation of concerns with Models, Views, and Controllers.
- **Smarty Template Engine** – Write clean, logic-free templates with caching, layouts, custom functions, and built-in security against XSS.
- **Simple Routing** – Define clean, RESTful routes with support for dynamic parameters and middleware (`routes.php`).
- **Centralized Configuration** – All site settings stored in `config.conf` with PHP-based `Config.php` reader.
- **Hook System** – Tap into framework events with custom hooks (`hooks/` directory).
- **Middleware Support** – Filter HTTP requests before they reach your controllers (`middleware/` directory).
- **Lightweight & Fast** – Minimal overhead with no unnecessary dependencies.
- **Database Abstraction** – Built-in query builder and active record pattern (or ORM).
- **Request & Response Handling** – Object-oriented wrappers for input, session, cookies, and output.
- **CSRF & XSS Protection** – Built-in security helpers (Smarty auto-escaping adds an extra layer).
- **Error Handling & Debugging** – Custom error pages and debug mode with detailed logs.

---

## Core Concepts

| Concept      | Description |
|--------------|-------------|
| **Models**   | Interact with your database. Contain business logic and data validation (`jephy-mvc/app/models/`). |
| **Views**    | Smarty templates (`.tpl` files) that separate HTML from PHP logic. Stored in `jephy-mvc/app/views/`. |
| **Controllers** | Receive requests, call models, and assign data to Smarty views (`jephy-mvc/app/controllers/`). |
| **Routes**   | Map URLs to controller methods in `jephy-mvc/routes.php` (e.g., `/users` → `UserController@index`). |
| **Middleware** | Run code before or after controller execution (`jephy-mvc/app/middleware/`). |
| **Hooks**    | Attach custom logic to framework lifecycle events (`jephy-mvc/app/hooks/`). |
| **Config**   | Key-value configuration stored in `jephy-mvc/config.conf` and accessed via `Config` class. |

---

## Installation

> **Note:** Composer support is coming soon. For now, please use the GitHub option below.

### Requirements
- PHP 8.0+
- MySQL / PostgreSQL / SQLite (optional)
- Smarty (included with the framework)
- Git (for cloning)
- Apache / Nginx with mod_rewrite enabled

### Option 1: Clone from GitHub (Recommended)

```bash
git clone https://github.com/yourusername/jephy-mvc.git
cd jephy-mvc
```

### Option 2: Download ZIP from GitHub

1. Visit `https://github.com/yourusername/jephy-mvc`
2. Click the **"Code"** button → **"Download ZIP"**
3. Extract the ZIP file to your project folder

### Post-Installation Setup

```bash
# Copy and configure your environment settings
cp jephy-mvc/example.config.conf jephy-mvc/config.conf

# Set proper permissions (Linux/Mac)
chmod -R 775 jephy-mvc/app/cache/
chmod -R 775 vendor/

# Configure your web server's document root to point to the /public folder
```

> **No Composer dependencies required** – The framework ships with all necessary core components and Smarty Engine pre-included.

---

## Correct Folder Structure

```
your-project/
├── jephy-mvc/                 (Framework core & application code)
│   ├── app/
│   │   ├── cache/             (Smarty cache files)
│   │   ├── controllers/       (Your controllers)
│   │   ├── models/            (Your models)
│   │   ├── hooks/             (Custom hooks/events)
│   │   ├── middleware/        (Request filters)
│   │   └── views/             (Smarty .tpl templates)
│   │
│   ├── core/
│   │   ├── Framework.php      (Main application bootstrap)
│   │   ├── Controller.php     (Base controller class)
│   │   ├── Router.php         (Routing engine)
│   │   ├── Config.php         (Configuration reader)
│   │   └── ...                (Other core classes)
│   │
│   ├── bootstrap.php          (Initializes the framework)
│   ├── routes.php             (Define your routes here)
│   ├── config.conf            (Your site configuration)
│   └── example.config.conf    (Configuration template)
│
├── public/                    (Webroot - document root)
│   ├── assets/                (CSS, JS, images)
│   ├── .htaccess              (Apache rewrite rules)
│   ├── favicon.png
│   └── index.php              (Front controller)
│
└── vendor/                    (Third-party libraries)
```

---

## Configuration System

Jephy-MVC uses a simple `config.conf` file (INI-style) for all site settings located in `jephy-mvc/config.conf`:

### `config.conf` Example:
```ini
[app]
name = "My Jephy-MVC App"
debug = true
timezone = "America/New_York"

[database]
host = "localhost"
name = "myapp_db"
user = "root"
password = "secret"
driver = "mysql"

[smarty]
caching = false
cache_lifetime = 3600
auto_escape = true
template_dir = "../jephy-mvc/app/views/"
compile_dir = "../jephy-mvc/app/cache/"
cache_dir = "../jephy-mvc/app/cache/"

[paths]
base_url = "/"
assets_url = "/assets/"
```

### Accessing Configuration in Your Code:
```php
<?php
use Core\Config;

// Get a single value
$appName = Config::get('app.name');
$isDebug = Config::get('app.debug', false); // With default value

// Get entire section
$dbConfig = Config::getSection('database');

// Check if config exists
if (Config::has('smarty.caching')) {
    // Do something
}
```

---

## Basic Usage Example

**1. Define your routes** (`jephy-mvc/routes.php`):
```php
<?php
$router->get('/', 'HomeController@index');
$router->get('/users', 'UserController@index');
$router->post('/users/store', 'UserController@store');
```

**2. Create a controller** (`jephy-mvc/app/controllers/UserController.php`):
```php
<?php
namespace App\Controllers;

use App\Models\User;
use Core\Controller;

class UserController extends Controller {
    public function index() {
        $users = User::all();
        
        // Assign data to Smarty template
        $this->view->assign('users', $users);
        $this->view->assign('pageTitle', 'User List');
        
        // Render the Smarty template
        $this->view->display('users/index.tpl');
    }
    
    public function store() {
        $data = $this->request->post();
        
        // Validation and model logic
        $user = new User();
        $user->name = $data['name'];
        $user->email = $data['email'];
        $user->save();
        
        $this->redirect('/users');
    }
}
```

**3. Create a model** (`jephy-mvc/app/models/User.php`):
```php
<?php
namespace App\Models;

use Core\Model;

class User extends Model {
    protected $table = 'users';
    protected $fillable = ['name', 'email'];
}
```

**4. Create a Smarty view** (`jephy-mvc/app/views/users/index.tpl`):
```smarty
{extends file="layouts/app.tpl"}

{block name="content"}
    <h1>{$pageTitle}</h1>
    
    <ul>
    {foreach $users as $user}
        <li>{$user->name|escape} - {$user->email|escape}</li>
        {forelse}
        <li>No users found.</li>
    {/foreach}
    </ul>
    
    <a href="{url('users/create')}">Add User</a>
{/block}
```

**5. Create a layout** (`jephy-mvc/app/views/layouts/app.tpl`):
```smarty
<!DOCTYPE html>
<html>
<head>
    <title>{$pageTitle|default:"Jephy-MVC"}</title>
    <link rel="stylesheet" href="{asset('css/style.css')}">
</head>
<body>
    {include file="partials/header.tpl"}
    
    <main>
        {block name="content"}{/block}
    </main>
    
    {include file="partials/footer.tpl"}
</body>
</html>
```

**6. Run the built-in PHP server** (for development):
```bash
cd public
php -S localhost:8000
```

Then visit `http://localhost:8000/users`

---

## Middleware Example

Create middleware in `jephy-mvc/app/middleware/AuthMiddleware.php`:
```php
<?php
namespace App\Middleware;

use Core\Middleware;

class AuthMiddleware extends Middleware {
    public function handle($request, $next) {
        if (!isset($_SESSION['user_id'])) {
            $this->redirect('/login');
        }
        
        return $next($request);
    }
}
```

Then register it in `jephy-mvc/routes.php`:
```php
$router->get('/dashboard', 'DashboardController@index')->middleware('AuthMiddleware');
```

---

## Hooks System Example

Create a hook in `jephy-mvc/app/hooks/BeforeRouteHook.php`:
```php
<?php
namespace App\Hooks;

class BeforeRouteHook {
    public function run($params) {
        // Execute logic before every route
        error_log("Request received for: " . $_SERVER['REQUEST_URI']);
    }
}
```

---

## Why Smarty?

| Benefit | Description |
|---------|-------------|
| **Logic-free templates** | No PHP in your views — only `{if}`, `{foreach}`, `{$var}`. |
| **Automatic escaping** | Prevent XSS attacks with `{$var|escape}` or auto-escaping. |
| **Template caching** | Dramatically improve performance by caching compiled templates. |
| **Reusable blocks** | Use `{block}` and `{extends}` for DRY layouts. |
| **Custom functions** | Create Smarty plugins like `{csrf_token}` or `{asset}`. |
| **Familiar syntax** | Easy for frontend developers who don't know PHP. |

---

## Common Tasks

| Task                          | Description / Location |
|-------------------------------|------------------------|
| **Change site configuration** | Edit `jephy-mvc/config.conf` |
| **Add a new page**            | Create route → controller → Smarty `.tpl` |
| **Pass data to view**         | Use `$this->view->assign('key', $value)` in controller |
| **Create a layout**           | Make base `.tpl` in `jephy-mvc/app/views/layouts/` with `{block}` |
| **Include a partial**         | Use `{include file="partials/header.tpl"}` |
| **Enable Smarty caching**     | Set `smarty.caching = true` in `config.conf` |
| **CSRF protection**           | Add `{csrf_field}` to forms |
| **Access config anywhere**    | `\Core\Config::get('key')` |
| **Add middleware**            | Create class in `jephy-mvc/app/middleware/` and attach to route |
| **Add hooks**                 | Create class in `jephy-mvc/app/hooks/` and register in bootstrap |

---

## Updating the Framework

Since Composer is not yet supported, updates are manual:

```bash
cd your-project
git pull origin main
```

> **Important:** Back up your `jephy-mvc/app/`, `jephy-mvc/config.conf`, and `jephy-mvc/routes.php` files before pulling, as core updates may override certain directories.

---

## Documentation Sections (Full Docs)

1. **Getting Started**  
   - Installation from GitHub (Clone vs ZIP)  
   - Server Configuration (Apache/Nginx/Dev Server)  
   - Understanding `config.conf`  

2. **Core Concepts**  
   - Routing (`jephy-mvc/routes.php`)  
   - Controllers (`jephy-mvc/app/controllers/`)  
   - Models (`jephy-mvc/app/models/`)  
   - Views with Smarty (`jephy-mvc/app/views/`)  

3. **Configuration System**  
   - `config.conf` Syntax & Sections  
   - Using the `Config` Class  
   - Environment-specific configs  

4. **Smarty Deep Dive**  
   - Template Inheritance (`{extends}`, `{block}`)  
   - Built-in Modifiers  
   - Custom Functions & Plugins  
   - Template Caching Strategies  

5. **Middleware**  
   - Creating Middleware  
   - Global & Route-Specific Middleware  

6. **Hooks System**  
   - Available Framework Hooks  
   - Creating Custom Hooks  

7. **Security**  
   - CSRF Protection  
   - XSS Prevention (Smarty auto-escaping)  
   - Input Validation & Sanitization  

8. **Database**  
   - Query Builder  
   - Models & Relationships  
   - Raw SQL Queries  

9. **Error Handling & Logging**  
   - Debug Mode  
   - Custom Error Pages  
   - Logging  

10. **Advanced Topics**  
    - Service Container  
    - Events & Listeners  
    - API Development  

11. **Testing**  
    - Unit Testing Setup  
    - Mocking Smarty Views  

12. **Deployment**  
    - Production Configuration  
    - Apache/Nginx Setup  
    - Smarty Cache Management  

13. **Contributing**  
    - How to Contribute  
    - Coding Standards  
    - Pull Request Process  

---

## Roadmap

| Feature | Status |
|---------|--------|
| GitHub installation | ✅ Available |
| Smarty Engine integration | ✅ Available |
| Core MVC structure | ✅ Available |
| Hook system | ✅ Available |
| Middleware support | ✅ Available |
| `config.conf` parser | ✅ Available |
| Composer support | 🚧 Planned (Q3 2025) |
| CLI tool for scaffolding | 🚧 Planned |
| Official documentation site | 🚧 In progress |

---

## Support & Community

- **GitHub Issues** – Report bugs or request features  
- **GitHub Discussions** – Ask questions and share ideas  
- **Examples Repository** – Sample apps built with Jephy-MVC  

---

## License

Jephy-MVC is open-source software licensed under the **MIT License**.

---

Let me know if you'd like me to expand on any specific section or if the structure now matches exactly!