# Differences from Planning Doc

* Adding PATCH route for ADMIN to update user roles.
* ToDoList has owner_id instead of user_id
* POST /api/list/: Body arguments isPublic and ownerId are both optional.
* POST /api/listitem instead of /api/listitems
* POST /api/listitem is used to create new To-Do list items instead of POST /api/list/:list_id/items
