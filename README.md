# UniBase

UniBase is a web service for storing and retrieving data. It supports various data manipulation operations including data storage, retrieval, update, deletion, and table management.

## Functional Requirements

### Data Storage and Retrieval
- The service must accept requests containing a table name and JSON data.
- For each table name, a corresponding file must be created to store the data.
- If a new message comes with the same table name, the data must be appended to the existing file.
- The service must return an index for the newly added data.

### Data Retrieval
- UniBase must support retrieval of data by table name:
  - Retrieve all entries.
  - Retrieve data by index.
  - Retrieve data by searching any of the fields.

### Data Manipulation
- UniBase must support updating rows in a table by index.
- UniBase must support deleting rows in a table by index.
- UniBase must support deletion of an entire table by table name.

## Non-Functional Requirements

### Performance
- UniBase should handle multiple requests concurrently.
- UniBase should be optimized for fast data retrieval and manipulation.

### Scalability
- UniBase should be designed to scale horizontally to handle increased load.

### Security
- UniBase should validate incoming data to prevent injection attacks.
- UniBase should ensure that data retrieval, update, and deletion operations are authenticated.

### Reliability
- UniBase should ensure data integrity during storage and retrieval operations.
- UniBase should handle file I/O errors gracefully and provide meaningful error messages.

### Usability
- The API should have clear and consistent endpoints for storing, retrieving, updating, and deleting data.
- The API should provide meaningful responses for success and error cases.

## API Endpoints

### Store Data
- **Endpoint:** `POST /data`
- **Request Body:** `{ "table_name": "string", "data": { ...json... } }`
- **Response:** `{ "index": "number" }`

### Retrieve All Data
- **Endpoint:** `GET /data/{table_name}`
- **Response:** `{ "data": [ ... ] }`

### Retrieve Data by Index
- **Endpoint:** `GET /data/{table_name}/{index}`
- **Response:** `{ "data": { ...json... } }`

### Search Data
- **Endpoint:** `POST /data/search`
- **Request Body:** `{ "table_name": "string", "query": { ... } }`
- **Response:** `{ "data": [ ... ] }`

### Update Data
- **Endpoint:** `PUT /data/{table_name}/{index}`
- **Request Body:** `{ "data": { ...json... } }`
- **Response:** `{ "status": "success" }`

### Delete Data by Index
- **Endpoint:** `DELETE /data/{table_name}/{index}`
- **Response:** `{ "status": "success" }`

### Delete Table
- **Endpoint:** `DELETE /data/{table_name}`
- **Response:** `{ "status": "success" }`

## Data Format

### Table File Structure
- Each table should be stored in a separate file, e.g., `table_name.json`.
- The file should contain an array of JSON objects, each representing a row of data.

### Index Management
- Each row of data should be assigned a unique index upon insertion.
- The index should be returned in the response to the insertion request.

## Error Handling

### Invalid Table Name
- Return a 400 error if the table name is invalid.

### Invalid JSON Data
- Return a 400 error if the JSON data is malformed.

### Table Not Found
- Return a 404 error if the specified table does not exist.

### Index Not Found
- Return a 404 error if the specified index does not exist in the table.

### Internal Server Errors
- Return a 500 error for any unhandled server errors.

## Logging and Monitoring

### Request Logging
- Log all incoming requests with timestamps and request details.

### Error Logging
- Log all errors with detailed error messages and stack traces.

### Monitoring
- Implement monitoring to track service performance and availability.

## Documentation

### API Documentation
- Provide detailed API documentation with examples for each endpoint.
- Include information on request and response formats, error codes, and usage scenarios.
