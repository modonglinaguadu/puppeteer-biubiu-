const puppeteer = require("puppeteer");
const browserOption = require("./const");
const users = require("./users");

//执行
users.map(async (item) => {
    const browser = await puppeteer.launch(browserOption.dev);
    const page = await browser.newPage();
    await page.goto(browserOption.pageUrl, { timeout: 0 });
    //输入帐号名
    await page.type(".rfm input", item.userName);
    await page.type(".rfm input[name=password]", item.password);
    await page.click("#captcha1 > div > div > div > div.td-btn-logo");
    //截获验证成功
    await getResponseMsg(page);
    await waitTime(1000);
    console.log(`${item.userName} :验证成功`);
    await page.click("button[name=loginsubmit]");
    console.log(`${item.userName} :登录成功`);
    await page.waitForNavigation({
        timeout: 0,
    });
    console.log(`${item.userName} :主界面请求完成`);
    const linkArr = await page.$$eval(".picList >li > .deanscpic > a", (el) => {
        return [el[0].href, el[1].href];
    });
    console.log(linkArr);
    await gotoComment(page, linkArr[0]);
    console.log(`${item.userName} :评论第一个完成，开始等待30秒`);
    await waitTime(30000);
    console.log(`${item.userName} :等待完成30秒，去评论第二个`);
    await gotoComment(page, linkArr[1]);
    console.log(`${item.userName} :评论完成，准备关闭`);
    await waitTime(1000);
    await browser.close();
});

//拦截请求
async function getResponseMsg(page) {
    return new Promise((resolve, reject) => {
        page.on("response", (request) => {
            // console.log(request.url());
            if (
                request
                    .url()
                    .indexOf(
                        "https://sphinx.tongdun.net/sphinx/validatecode/"
                    ) > -1
            ) {
                resolve();
            } else {
            }
        });
    })
        .catch(new Function())
        .then();
}

//延时等待
async function waitTime(time) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}

//去评论
async function gotoComment(page, url) {
    await page.goto(url, { timeout: 0 });
    // await page.waitForNavigation({
    //     timeout: 0,
    // });
    await page.$eval("#vmessage", (input) => (input.value = ""));
    await page.type("#vmessage", "感谢楼主分享!");
    await page.click("#vreplysubmit");
    await commentSuccess(page);
}

//等待评论成功
async function commentSuccess(page) {
    return new Promise((resolve, reject) => {
        page.on("response", (request) => {
            // console.log(request.url());
            if (
                request.url().indexOf("https://www.biubiuiu.com/forum.php") > -1
            ) {
                resolve();
            } else {
            }
        });
    })
        .catch(new Function())
        .then();
}
