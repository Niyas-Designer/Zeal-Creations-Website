import {
  deleteObject,
  getBytes,
  ref,
  uploadBytes,
} from "firebase/storage";

import { storage } from "./firebase";

export async function testFirebaseStorage() {
  const path =
    "catalogue/system/connection-test.json";

  const testRef =
    ref(storage, path);

  const testData = {
    connected: true,
    service:
      "ZEAL Catalogue",
    test:
      "Firebase Storage Read Write Delete",
    timestamp:
      new Date().toISOString(),
  };

  try {
    console.log(
      "1. Testing Firebase Storage WRITE...",
    );

    const blob =
      new Blob(
        [
          JSON.stringify(
            testData,
            null,
            2,
          ),
        ],
        {
          type:
            "application/json",
        },
      );

    await uploadBytes(
      testRef,
      blob,
      {
        contentType:
          "application/json",
      },
    );

    console.log(
      "✅ WRITE success",
    );

    console.log(
      "2. Testing Firebase Storage READ...",
    );

    const bytes =
      await getBytes(
        testRef,
      );

    const text =
      new TextDecoder().decode(
        bytes,
      );

    const result =
      JSON.parse(text);

    console.log(
      "✅ READ success",
      result,
    );

    console.log(
      "3. Testing Firebase Storage DELETE...",
    );

    await deleteObject(
      testRef,
    );

    console.log(
      "✅ DELETE success",
    );

    console.log(
      "🔥 FIREBASE STORAGE FULLY CONNECTED",
    );

    return {
      success: true,
      bucket:
        storage.app.options
          .storageBucket,
      data: result,
    };
  } catch (error) {
    console.error(
      "❌ FIREBASE STORAGE TEST FAILED",
      error,
    );

    return {
      success: false,
      code:
        error?.code ||
        "",
      message:
        error?.message ||
        "Unknown error",
    };
  }
}