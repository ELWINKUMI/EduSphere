// MongoDB script to clean up old 'code' fields and fix unique index issues for EduSphere courses
// Usage: Run this in the MongoDB shell (mongosh) after connecting to your database

// 1. Remove all courses with code: null
db.courses.deleteMany({ code: null })

// 2. Drop the old unique index on 'code' if it exists
try { db.courses.dropIndex('code_1'); } catch(e) { print('Index not found, skipping'); }

// 3. Rename any 'code' fields to 'enrollmentCode' if needed
db.courses.find({ code: { $exists: true, $ne: null } }).forEach(function(doc) {
  db.courses.updateOne(
    { _id: doc._id },
    { $set: { enrollmentCode: doc.code }, $unset: { code: "" } }
  );
  print('Migrated course ' + doc._id + ' code to enrollmentCode: ' + doc.code);
});

// 4. Ensure a unique index on 'enrollmentCode'
db.courses.createIndex({ enrollmentCode: 1 }, { unique: true });

print('Course code cleanup complete!');
