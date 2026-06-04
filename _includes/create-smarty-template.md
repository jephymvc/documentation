
### Step 6: Create Smarty Templates

```smarty
{* jephy-mvc/app/views/layouts/app.tpl *}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{$pageTitle|default:$siteName} | {$siteName}</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gray-100">
    <nav class="bg-white shadow-lg">
        <div class="container mx-auto px-4">
            <div class="flex justify-between items-center py-4">
                <a href="/" class="text-xl font-bold text-gray-800">{$siteName}</a>
                
                <div class="space-x-4">
                    <a href="/blog" class="text-gray-600 hover:text-gray-800">Blog</a>
                    <a href="/about" class="text-gray-600 hover:text-gray-800">About</a>
                    <a href="/contact" class="text-gray-600 hover:text-gray-800">Contact</a>
                    
                    {if $isLoggedIn}
                        <a href="/dashboard" class="text-gray-600 hover:text-gray-800">Dashboard</a>
                        <a href="/logout" class="text-red-600 hover:text-red-800">Logout</a>
                        <span class="text-gray-600">Welcome, {$currentUser.name}!</span>
                    {else}
                        <a href="/login" class="text-blue-600 hover:text-blue-800">Login</a>
                        <a href="/register" class="text-green-600 hover:text-green-800">Register</a>
                    {/if}
                </div>
            </div>
        </div>
    </nav>
    
    {if $flashMessage}
        <div class="container mx-auto px-4 mt-4">
            <div class="alert alert-{$flashType} p-4 rounded-lg 
                {if $flashType == 'success'}bg-green-100 text-green-800
                {elseif $flashType == 'error'}bg-red-100 text-red-800
                {else}bg-blue-100 text-blue-800{/if}">
                {$flashMessage}
            </div>
        </div>
    {/if}
    
    <main class="container mx-auto px-4 py-8">
        {block name="content"}{/block}
    </main>
    
    <footer class="bg-white shadow-lg mt-8 py-6">
        <div class="container mx-auto px-4 text-center text-gray-600">
            &copy; {$currentYear} {$siteName}. All rights reserved.
        </div>
    </footer>
</body>
</html>

{* jephy-mvc/app/views/home/index.tpl *}
{extends file="layouts/app.tpl"}

{block name="content"}
    <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-800 mb-4">Welcome to {$siteName}</h1>
        <p class="text-xl text-gray-600">Share your thoughts with the world</p>
    </div>
    
    {if $featuredPosts|count > 0}
        <div class="mb-12">
            <h2 class="text-2xl font-bold mb-6">Featured Posts</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                {foreach $featuredPosts as $post}
                    <div class="bg-white rounded-lg shadow-md overflow-hidden">
                        {if $post.featured_image}
                            <img src="{$post.featured_image}" alt="{$post.title}" class="w-full h-48 object-cover">
                        {/if}
                        <div class="p-6">
                            <h3 class="text-xl font-semibold mb-2">
                                <a href="/blog/{$post.slug}" class="text-gray-800 hover:text-blue-600">{$post.title}</a>
                            </h3>
                            <p class="text-gray-600 mb-4">{$post.excerpt|truncate:120}</p>
                            <div class="text-sm text-gray-500">
                                By {$post.author.name} | {$post.published_at|date_format:"%B %d, %Y"}
                            </div>
                        </div>
                    </div>
                {/foreach}
            </div>
        </div>
    {/if}
    
    <div>
        <h2 class="text-2xl font-bold mb-6">Recent Posts</h2>
        <div class="space-y-6">
            {foreach $recentPosts as $post}
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h3 class="text-xl font-semibold mb-2">
                        <a href="/blog/{$post.slug}" class="text-gray-800 hover:text-blue-600">{$post.title}</a>
                    </h3>
                    <p class="text-gray-600 mb-4">{$post.excerpt|truncate:160}</p>
                    <div class="flex justify-between items-center text-sm text-gray-500">
                        <span>By {$post.author.name}</span>
                        <span>{$post.published_at|date_format:"%B %d, %Y"}</span>
                        <span><i class="far fa-eye"></i> {$post.views} views</span>
                    </div>
                </div>
            {/foreach}
        </div>
    </div>
    
    <div class="mt-12 bg-white rounded-lg shadow-md p-6">
        <h3 class="text-xl font-bold mb-4">Categories</h3>
        <div class="flex flex-wrap gap-2">
            {foreach $categories as $category}
                <a href="/blog?category={$category.slug}" 
                   class="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-full text-sm">
                    {$category.name} ({$category.posts_count})
                </a>
            {/foreach}
        </div>
    </div>
{/block}

{* jephy-mvc/app/views/posts/show.tpl *}
{extends file="layouts/app.tpl"}

{block name="content"}
    <article class="bg-white rounded-lg shadow-md p-8 mb-8">
        <h1 class="text-3xl font-bold mb-4">{$post.title}</h1>
        
        <div class="flex items-center text-sm text-gray-500 mb-6">
            <span>By {$post.author.name}</span>
            <span class="mx-2">•</span>
            <span>{$post.published_at|date_format:"%B %d, %Y"}</span>
            <span class="mx-2">•</span>
            <span><i class="far fa-eye"></i> {$post.views} views</span>
        </div>
        
        {if $post.featured_image}
            <img src="{$post.featured_image}" alt="{$post.title}" class="w-full rounded-lg mb-6">
        {/if}
        
        <div class="prose max-w-none">
            {$post.content}
        </div>
        
        {if $post.categories|count > 0}
            <div class="mt-6 pt-6 border-t">
                <h3 class="text-lg font-semibold mb-2">Categories:</h3>
                <div class="flex flex-wrap gap-2">
                    {foreach $post.categories as $category}
                        <a href="/blog?category={$category.slug}" 
                           class="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-full text-sm">
                            {$category.name}
                        </a>
                    {/foreach}
                </div>
            </div>
        {/if}
    </article>
    
    {if $relatedPosts|count > 0}
        <div class="mb-8">
            <h2 class="text-2xl font-bold mb-4">Related Posts</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                {foreach $relatedPosts as $related}
                    <div class="bg-white rounded-lg shadow-md p-4">
                        <h3 class="font-semibold mb-2">
                            <a href="/blog/{$related.slug}" class="text-gray-800 hover:text-blue-600">{$related.title}</a>
                        </h3>
                        <p class="text-sm text-gray-600">{$related.excerpt|truncate:100}</p>
                    </div>
                {/foreach}
            </div>
        </div>
    {/if}
    
    <div class="bg-white rounded-lg shadow-md p-8">
        <h2 class="text-2xl font-bold mb-6">Comments ({$comments|count})</h2>
        
        {if $comments|count > 0}
            <div class="space-y-4 mb-8">
                {foreach $comments as $comment}
                    <div class="border-b pb-4">
                        <div class="font-semibold">
                            {if $comment.user_id}
                                {$comment.user.name}
                            {else}
                                {$comment.author_name}
                            {/if}
                            <span class="text-sm text-gray-500 ml-2">
                                {$comment.created_at|date_format:"%B %d, %Y"}
                            </span>
                        </div>
                        <p class="text-gray-700 mt-2">{$comment.content}</p>
                    </div>
                {/foreach}
            </div>
        {/if}
        
        <h3 class="text-xl font-semibold mb-4">Leave a Comment</h3>
        
        <form id="commentForm" method="POST" class="space-y-4">
            <input type="hidden" name="csrf_token" value="{$csrfToken}">
            
            {if !$isLoggedIn}
                <div>
                    <label class="block text-sm font-medium mb-2">Name *</label>
                    <input type="text" name="author_name" required class="w-full border rounded-lg px-3 py-2">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-2">Email *</label>
                    <input type="email" name="author_email" required class="w-full border rounded-lg px-3 py-2">
                </div>
            {/if}
            
            <div>
                <label class="block text-sm font-medium mb-2">Comment *</label>
                <textarea name="content" rows="4" required class="w-full border rounded-lg px-3 py-2"></textarea>
            </div>
            
            <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                Submit Comment
            </button>
        </form>
    </div>
    
    <script>
    document.getElementById('commentForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        
        const response = await fetch(window.location.href + '/comment', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert(result.message);
            e.target.reset();
            location.reload();
        } else {
            alert(result.error);
        }
    });
    </script>
{/block}
```

### Step 7: Run Your Application

```bash
# Start the built-in PHP server
cd public
php -S localhost:8000

# Visit http://localhost:8000 in your browser
```

---
