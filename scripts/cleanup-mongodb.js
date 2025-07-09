// Simple database cleanup script to fix enrollment code duplicate key issues
// Run this in the MongoDB shell or using a MongoDB client

// First, connect to your MongoDB database
// Then run these commands:

// 1. Remove courses with null or empty enrollment codes
db.courses.deleteMany({
  $or: [
    { enrollmentCode: null },
    { enrollmentCode: undefined },
    { enrollmentCode: "" }
  ]
})

// 2. Find courses without enrollment codes and update them
db.courses.find({
  $or: [
    { enrollmentCode: { $exists: false } },
    { enrollmentCode: null },
    { enrollmentCode: "" }
  ]
}).forEach(function(course) {
  var newCode = Math.random().toString(36).substring(2, 8).toUpperCase()
  
  // Check if code exists
  while (db.courses.findOne({ enrollmentCode: newCode })) {
    newCode = Math.random().toString(36).substring(2, 8).toUpperCase()
  }
  
  db.courses.updateOne(
    { _id: course._id }, 
    { $set: { enrollmentCode: newCode } }
  )
  
  print("Updated course " + course._id + " with code: " + newCode)
})

// 3. Drop the existing index if it exists
db.courses.dropIndex({ enrollmentCode: 1 })

// 4. Create a new unique index
db.courses.createIndex({ enrollmentCode: 1 }, { unique: true })

print("Database cleanup completed!")