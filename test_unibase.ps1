# Variables
$BaseUrl = "http://localhost:3000"
$TableName = "test_table"
$EntryId = ""
$Data = @{
    name = "John Doe"
    age = 30
} | ConvertTo-Json
$UpdatedData = @{
    name = "Jane Doe"
    age = 25
} | ConvertTo-Json

# Function to print test results
function Print-Result {
    param (
        [bool]$Success,
        [string]$Message
    )
    if ($Success) {
        Write-Host "Success: $Message"
    } else {
        Write-Host "Error: $Message"
        exit 1
    }
}

# Test Store Data
Write-Host "Testing Store Data..."
$response = Invoke-RestMethod -Method Post -Uri "$BaseUrl/data/store" -Headers @{"Content-Type"="application/json"} -Body (@{table_name=$TableName; data=$Data} | ConvertTo-Json)
$EntryId = $response.entry_id
Print-Result ($? -eq $true) "Store Data: $response"

# Test Retrieve All Data
Write-Host "Testing Retrieve All Data..."
$response = Invoke-RestMethod -Method Get -Uri "$BaseUrl/data/$TableName/all"
Print-Result ($? -eq $true) "Retrieve All Data: $response"

# Test Retrieve Data by Entry ID
Write-Host "Testing Retrieve Data by Entry ID..."
$response = Invoke-RestMethod -Method Get -Uri "$BaseUrl/data/$TableName/entry/$EntryId"
Print-Result ($? -eq $true) "Retrieve Data by Entry ID: $response"

# Test Update Data by Entry ID
Write-Host "Testing Update Data by Entry ID..."
$response = Invoke-RestMethod -Method Put -Uri "$BaseUrl/data/$TableName/update/$EntryId" -Headers @{"Content-Type"="application/json"} -Body (@{data=$UpdatedData} | ConvertTo-Json)
Print-Result ($? -eq $true) "Update Data by Entry ID: $response"

# Test Retrieve Data by Entry ID after Update
Write-Host "Testing Retrieve Data by Entry ID after Update..."
$response = Invoke-RestMethod -Method Get -Uri "$BaseUrl/data/$TableName/entry/$EntryId"
Print-Result ($? -eq $true) "Retrieve Data by Entry ID after Update: $response"

# Test Delete Data by Entry ID
Write-Host "Testing Delete Data by Entry ID..."
$response = Invoke-RestMethod -Method Delete -Uri "$BaseUrl/data/$TableName/delete/$EntryId"
Print-Result ($? -eq $true) "Delete Data by Entry ID: $response"

# Test Delete Table
Write-Host "Testing Delete Table..."
$response = Invoke-RestMethod -Method Delete -Uri "$BaseUrl/data/$TableName/delete"
Print-Result ($? -eq $true) "Delete Table: $response"

Write-Host "All tests completed successfully."
