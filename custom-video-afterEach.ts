  test.afterEach(async ({}, testInfo: TestInfo) => {
    const video = page.video();
    if (video) {
      if (testInfo.status !== testInfo.expectedStatus) {
        const { title } = testInfo;
        // if blank title then leave original video
        if (title) {
          const videoFileName = testInfo.title.replace(/ /g, '-');
          video.saveAs(`${testInfo.outputDir}/${videoFileName}.webm`);
          await page.close();
          video.delete();
        }
      }
      await page.close();
      video.delete();
    }
  });
