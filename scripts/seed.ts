import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { curriculum, DEMO_USER } from "../src/content/curriculum";
import { Lesson } from "../src/lib/models/lesson";
import { Module } from "../src/lib/models/module";
import { Problem } from "../src/lib/models/problem";
import { Progress } from "../src/lib/models/progress";
import { Submission } from "../src/lib/models/submission";
import { Track } from "../src/lib/models/track";
import { User } from "../src/lib/models/user";

process.env.MONGODB_URI ??= "mongodb://127.0.0.1:27017/codexercise";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function md(folder: "lessons" | "prompts" | "pembahasan", slug: string) {
  return readFileSync(join(root, "src/content", folder, `${slug}.md`), "utf8");
}

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI!);
  console.log("Terhubung ke MongoDB");

  await Promise.all([
    Track.deleteMany({}),
    Module.deleteMany({}),
    Lesson.deleteMany({}),
    Problem.deleteMany({}),
    Submission.deleteMany({}),
    Progress.deleteMany({}),
  ]);

  const passwordHash = await bcrypt.hash(DEMO_USER.password, 10);
  await User.findOneAndUpdate(
    { email: DEMO_USER.email },
    { email: DEMO_USER.email, name: DEMO_USER.name, passwordHash },
    { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
  );

  let lessonCount = 0;
  let problemCount = 0;

  for (const trackData of curriculum) {
    const track = await Track.create({
      slug: trackData.slug,
      title: trackData.title,
      description: trackData.description,
      order: trackData.order,
    });

    for (const moduleData of trackData.modules) {
      const mod = await Module.create({
        trackId: track._id,
        slug: moduleData.slug,
        title: moduleData.title,
        description: moduleData.description,
        order: moduleData.order,
      });

      for (const lessonData of moduleData.lessons) {
        await Lesson.create({
          moduleId: mod._id,
          slug: lessonData.slug,
          title: lessonData.title,
          markdown: md("lessons", lessonData.slug),
          order: lessonData.order,
        });
        lessonCount += 1;
      }

      for (const problemData of moduleData.problems) {
        await Problem.create({
          moduleId: mod._id,
          slug: problemData.slug,
          title: problemData.title,
          prompt: md("prompts", problemData.slug),
          starterCode: problemData.starterCode,
          language: problemData.language,
          difficulty: problemData.difficulty,
          skillLevel: problemData.skillLevel,
          functionName: problemData.functionName,
          sampleTests: problemData.sampleTests,
          hiddenTests: problemData.hiddenTests,
          pembahasan: md("pembahasan", problemData.slug),
          tags: problemData.tags,
          order: problemData.order,
        });
        problemCount += 1;
      }
    }
  }

  console.log(`Seed selesai: ${curriculum.length} track, ${lessonCount} materi, ${problemCount} soal.`);
  console.log(`User demo: ${DEMO_USER.email} / ${DEMO_USER.password}`);
  await mongoose.disconnect();
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
