import { Builder, By } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import { expect } from 'chai';
import { locators } from '../pages/locators';
import fs from 'fs';
import path from 'path';
import addContext from 'mochawesome/addContext';

interface IScreenshot {
  screenshot: any;
  takeScreenshot: boolean
}

async function takeScreenshot(driver: any): Promise<IScreenshot> {
  const screenshot = await driver.takeScreenshot();
  return {
    screenshot,
    takeScreenshot: true,
  }
}

describe('Selenium Simple HTML Test', function () {
  let driver: any;
  let screenshot: any;
  let isTakeScreenshot: boolean;
  this.timeout(30000); // Increase timeout for slower environments

  before(async () => {
    const options = new chrome.Options
    options.addArguments('--headless=new');
    options.addArguments('--no-sandbox');// disabled chrome sandbox security, Required for some CI environments, disable if not needed
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--disable-gpu');// disabled GPU hardware acceleration, Required for some CI environments, disable if not needed
    options.addArguments('--window-size=1920,1080');// set window size since headless mode set a small default size
    driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
    const htmlPath = `file://${__dirname}/../html/index.html`;
    await driver.get(htmlPath);
  });

  beforeEach(function () {
    isTakeScreenshot = false;
  });

  afterEach(async function () {
    if (isTakeScreenshot) {
      const title: string = this.currentTest?.title.replace(/ /g, '_').replace(/[^a-zA-Z0-9_]/g, '') as string;
      const mainPath = './reports/selenium/'
      const screenshotsPath = `screenshots/${title}.png`;
      const filePath = `${mainPath}/${screenshotsPath}`;
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, screenshot, 'base64');
      isTakeScreenshot = false;
      addContext(this, { title: title, value: screenshotsPath });
    }
  });

  after(async () => {
    await driver.quit();
  });

  it('should load the example page and verify the title', async () => {
    const title = await driver.getTitle();
    expect(title).to.equal('Test HTML Page');
  });

  it('Validate table exists', async () => {
    const table = await driver.findElement(By.css(locators.table));
    expect(table).to.exist;
    const ss = await takeScreenshot(driver);
    screenshot = ss.screenshot;
    isTakeScreenshot = ss.takeScreenshot;
  });

  it('Validate user name is bold when role is admin', async () => {
    const rows = await driver.findElements(By.css(locators.rows));
    for (let i = 0; i < rows.length; i++) {
      const role = await rows[i].findElement(By.css(locators.roleCell)).getText();
      const fontWeight = await rows[i].findElement(By.css(locators.usernameCell)).getCssValue('font-weight');
      expect(fontWeight).to.equal(role === 'admin' ? '700' : '400'); // 'bold' is usually represented as '700'
    }
  })

  it('Validate columns sequence is correct', async () => {
    const headerRows = await driver.findElements(By.css(`${locators.table} thead tr th`))
    const expectedHeaders = ['User Id', 'Name', 'Email', 'Role'];
    expect(headerRows.length).to.equal(expectedHeaders.length);
    for (let i = 0; i < expectedHeaders.length; i++) {
      const headerText = await headerRows[i].getText();
      expect(expectedHeaders[i]).to.equal(headerText)
    }
  })

  it('Validate email, name and role columns exist', async () => {
    const headerRows = await driver.findElements(By.css(`${locators.table} thead tr th`));
    const columnsText = await Promise.all(headerRows.map(async (header: any) => await header.getText()));
    expect(columnsText).to.include('User Id');
    expect(columnsText).to.include('Email');
    expect(columnsText).to.include('Name');
    expect(columnsText).to.include('Role');
  })

  it('Checks if the "N° Records found" information is presented', async () => {
    const totalRecords = await driver.findElement(By.css(locators.totalRecords))
    expect(totalRecords).to.exist
  })

  it('Checks if the "Records found" number is correct', async () => {
    const rows = await driver.findElements(By.css(locators.rows));
    const totalRecords = await driver.findElement(By.css(locators.totalRecords)).getText();
    expect(totalRecords).to.equal(`Records found: ${rows.length}`);
  })

})