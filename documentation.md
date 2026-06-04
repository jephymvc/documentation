---
layout: docs
name: Getting Started
---

# Getting Started
## Installation

Get up and running with Jephy MVC

# BaseEntity Class Usage Guide
## Overview

**BaseEntity** is an abstract Active Record pattern implementation for PHP that provides database CRUD operations with automatic timestamp handling, query building, and entity management.

## Prerequisites

Your application must have a **Database** class with the following methods:



- `getInstance()` - returns database singleton
- `insert($table, $data)` - returns inserted ID
- `update($table, $data, $where)` - returns affected rows
- `delete($table, $where)` - returns affected rows
- `select($table, $columns, $where, $orderBy, $limit, $offset)` - returns array of results
- `count($table, $where)` - returns row count

## Creating Entity Classes

Extend `BaseEntity.php` for each database table:

```php
// User.php
namespace App\Models;

use App\Core\BaseEntity;

class User extends BaseEntity
{
    protected static $table = 'users';
}
```

## Basic CRUD Operations

### Create New Record

```php

// Method 1: Using constructor + save()
$user = new User([
    'name' => 'John Doe',
    'email' => 'john@example.com'
]);
$user->save();

// Method 2: Using create() static method
$user = User::create([
    'name' => 'Jane Smith',
    'email' => 'jane@example.com'
]);
```

### Read Records

```php

// Find by ID
$user = User::find(1);

// Find all records
$allUsers = User::all();

// Find with conditions (findMany)
$admins = User::findMany([
    'where' => ['role' => 'admin']
]);

// Find first matching record
$user = User::findFirst([
    'where' => ['email' => 'john@example.com']
]);

// Using where() fluent interface
$users = User::where(['status' => 'active'])
    ->orderBy('created_at DESC')
    ->limit(10)
    ->get();

// Get first result from query
$firstUser = User::where(['role' => 'admin'])->first();

// Count records
$count = User::count(['where' => ['status' => 'active']]);
```

### Update Records

```php

// Method 1: Modify property and save
$user = User::find(1);
$user->name = 'John Updated';
$user->save();

// Method 2: Using update() method
$user = User::find(1);
$user->update(['name' => 'John Updated', 'email' => 'new@example.com']);
```

### Delete Records

```php

// Delete single entity
$user = User::find(1);
$user->delete();

// Delete by conditions
User::deleteWhere(['status' => 'inactive']);
```

## Advanced Query Features

### LIKE Queries with ProcessWhereConditions

```php

// Using string with wildcards
$users = User::findMany([
    'where' => ['name' => '%john%']  // LIKE '%john%'
]);

// Using Prisma-style syntax
$users = User::findMany([
    'where' => [
        'name' => ['contains' => 'john'],     // LIKE '%john%'
        'email' => ['startsWith' => 'admin'], // LIKE 'admin%'
        'bio' => ['endsWith' => 'dev']        // LIKE '%dev'
    ]
]);

// Advanced LIKE operators
$users = User::findMany([
    'where' => [
        'name' => ['like' => '%john%'],
        'email' => ['notLike' => '%spam%']
    ]
]);
```

### Complex Where Conditions

```php

// Where NOT conditions
$users = User::findMany([
    'where' => ['status' => 'active'],
    'whereNot' => ['role' => 'banned']
]);

// With ordering and pagination
$users = User::findMany([
    'where' => ['status' => 'active'],
    'orderBy' => 'created_at DESC',
    'take' => 20,
    'skip' => 40
]);

// Using count with conditions
$activeUsers = User::count([
    'where' => ['status' => 'active']
]);
```

### Alternative Find Methods

```php

// findManyAlt - No LIKE processing (faster for simple queries)
$users = User::findManyAlt([
    'where' => ['status' => 'active'],
    'orderBy' => 'name ASC'
]);

// findFirstAlt - No LIKE processing
$user = User::findFirstAlt([
    'where' => ['email' => 'exact@match.com']
]);
```

## Query Builder Interface

```php

// Fluent query builder
$users = User::query()
    ->where(['status' => 'active'])
    ->where(['role' => 'admin'])
    ->orderBy('created_at DESC')
    ->limit(5)
    ->get();

// Get first with query builder
$user = User::query()
    ->where(['email' => 'test@example.com'])
    ->first();

// Count with query builder
$count = User::query()
    ->where(['status' => 'active'])
    ->count();
```

## Entity State Management

### Checking Changes

```php

$user = User::find(1);
$user->name = 'New Name';

if ($user->isDirty()) {
    $changes = $user->getDirty();  // Returns ['name' => 'New Name']
    $user->save();
}
```

### Refreshing Entity

```php

$user = User::find(1);
$user->name = 'Temporary';

// Revert to database state
$user->refresh();  // Name reverts to original value
```

## Property Access

```php

// Magic getter/setter
$user = new User(['name' => 'John']);
echo $user->name;  // John
$user->email = 'john@example.com';

// Check if property exists
if (isset($user->name)) {
    // Property exists
}

// Convert to array
$data = $user->toArray();
```

## Timestamp Handling

The class automatically handles timestamps:

- `created_at` - automatically set on insert if not provided
- `updated_at` - automatically updated in `update()` method (not in basic `save()`)

**Note:** Only the `update()` method and `save()` automatically set `updated_at`. Basic `save()` only sets `created_at`.

## Best Practices

1. Always define `$table` in your entity classes
2. Use `create()` for simple record creation
3. Use `findMany()` with `take`/`skip` for pagination
4. Check `isDirty()` before saving to avoid unnecessary updates
5. Use `refresh()` after external updates to sync entity state
6. Prefer Prisma-style syntax (`contains`, `startsWith`, `endsWith`) for LIKE queries

## Example: Complete User Workflow

```php

// Create user
$user = User::create([
    'name' => 'John Doe',
    'email' => 'john@example.com',
    'status' => 'active'
]);

// Update user
$user->update(['status' => 'inactive']);

// Query users
$activeUsers = User::findMany([
    'where' => ['status' => 'active'],
    'orderBy' => 'name ASC'
]);

// Search users
$searchResults = User::findMany([
    'where' => ['name' => ['contains' => 'john']]
]);

// Delete if exists
if (User::exists(['where' => ['email' => 'old@example.com']])) {
    User::deleteWhere(['email' => 'old@example.com']);
}
```

## Notes & Limitations

- `whereNot` conditions are converted to `!=` operators (array/IN not supported)
- The `Database` class must handle operator arrays in the `where` parameter
- No built-in relationship handling (requires implementation in child classes)
```