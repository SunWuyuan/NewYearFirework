const WelcomePage = (aliasLinks) => `<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <link
      href="https://wuyuan.dev/NewYearFirework/files/css/make.css"
      rel="stylesheet"
    />
    <title>${SITE_TITLE}</title>
  </head>
  <body class="bg-indigo-700">
    <div class="w-full py-12 px-6 flex justify-center">
      <div class="flex flex-col items-center">
        <h1 class="text-4xl font-bold text-white">${SITE_TITLE}</h1>
        <p class="mt-2 text-lg text-indigo-300">
        一键生成新年祝福页面!
        </p>

        <div
          id="result"
          class="hidden flex flex-col items-center mt-12 bg-white shadow-lg p-8 rounded"
        >
          <h2 class="text-2xl font-bold text-gray-900">成功</h2>
          <p class="mt-2 text-gray-600">您现在可以访问您的页面:</p>
          <div
            class="mt-6 py-4 px-6 text-xl rounded bg-gray-200 flex items-center space-x-12"
          >
            <p id="destinationName"></p>
            <a
              id="destinationLink"
              class="border text-gray-500 border-gray-300 hover:bg-gray-300 rounded text-sm pl-2 pr-1 flex items-center"
              href="/"
              target="_blank"
            >
              打开
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 transform scale-75"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        </div>

        <div
          id="form"
          class="flex flex-col items-center mt-12 bg-white shadow-lg p-6 rounded space-y-6"
        >
          <div class="w-full">
            <label class="block text-gray-600 text-sm mb-2">特征码</label>
            <div class="flex space-x-2 items-center">
              <p class="py-2 text-lg font-bold tracking-wide">
                ${DOMAIN_NAME}/
              </p>
              <input
                class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:bg-white focus:border-purple-500"
                id="alias"
                type="text"
                placeholder="输入特征码"
              />
            </div>
            <p id="nameTakenWarning" class="hidden mt-2 text-sm text-red-400">
              Sorry, this name is already taken
            </p>
          </div>

          <div class="w-full">
            <label class="block text-gray-600 text-sm mb-2">
              输入您的祝福!            </label>

            <textarea
              class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:bg-white focus:border-purple-500"
              id="url"
              type="text"
              placeholder="新年快乐,孙悟元!"
            ></textarea>

            <p id="invalidURLWarning" class="hidden mt-1 text-sm text-red-400">
              错误!快去<a helf='https://space.bilibili.com/661404066'>作者B站</a>告诉作者这个bug!
            </p>
          </div>

          <button
            class="w-full flex items-center justify-center p-2 text-white bg-indigo-500 rounded hover:bg-indigo-700"
            onclick="submit()"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              id="spining-icon"
              class="h-6 w-6 mr-1 animate-spin hidden"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>一键生成!</span>
          </button>
        </div>

        <p class="mt-8 text-center text-indigo-400 text-xs">
          &copy; 2023  <a helf='https://wuyuan.dev'>孙悟元</a> ,使用Cloudflare Worker
        </p>
      </div>
    <!--  <div class="hidden xl:block ml-32">
        <h2 class="text-lg text-indigo-200 font-bold">刚刚生成了:</h2>
        <ul class="mt-4 space-y-3 text-white font-black text-xl tracking-wide">
          aliasLinks
        </ul>
      </div>-->
    </div>

    <script>
      const aliasInput = document.querySelector("#alias");
      const destinationInput = document.querySelector("#url");
      const spinningIcon = document.querySelector("#spining-icon");
      const resultDialog = document.querySelector("#result");
      const formDialog = document.querySelector("#form");
      const destinationLink = document.querySelector("#destinationLink");
      const destinationName = document.querySelector("#destinationName");
      const nameTakenWarning = document.querySelector("#nameTakenWarning");
      const invalidURLWarning = document.querySelector("#invalidURLWarning");
    var Base64 = {
        // 转码表
        table : [
                'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
                'I', 'J', 'K', 'L', 'M', 'N', 'O' ,'P',
                'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
                'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f',
                'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
                'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
                'w', 'x', 'y', 'z', '0', '1', '2', '3',
                '4', '5', '6', '7', '8', '9', '+', '/'
        ],
        UTF16ToUTF8 : function(str) {
            var res = [], len = str.length;
            for (var i = 0; i < len; i++) {
                var code = str.charCodeAt(i);
                if (code > 0x0000 && code <= 0x007F) {
                    // 单字节，这里并不考虑0x0000，因为它是空字节
                    // U+00000000 – U+0000007F 	0xxxxxxx
                    res.push(str.charAt(i));
                } else if (code >= 0x0080 && code <= 0x07FF) {
                    // 双字节
                    // U+00000080 – U+000007FF 	110xxxxx 10xxxxxx
                    // 110xxxxx
                    var byte1 = 0xC0 | ((code >> 6) & 0x1F);
                    // 10xxxxxx
                    var byte2 = 0x80 | (code & 0x3F);
                    res.push(
                        String.fromCharCode(byte1), 
                        String.fromCharCode(byte2)
                    );
                } else if (code >= 0x0800 && code <= 0xFFFF) {
                    // 三字节
                    // U+00000800 – U+0000FFFF 	1110xxxx 10xxxxxx 10xxxxxx
                    // 1110xxxx
                    var byte1 = 0xE0 | ((code >> 12) & 0x0F);
                    // 10xxxxxx
                    var byte2 = 0x80 | ((code >> 6) & 0x3F);
                    // 10xxxxxx
                    var byte3 = 0x80 | (code & 0x3F);
                    res.push(
                        String.fromCharCode(byte1), 
                        String.fromCharCode(byte2), 
                        String.fromCharCode(byte3)
                    );
                } else if (code >= 0x00010000 && code <= 0x001FFFFF) {
                    // 四字节
                    // U+00010000 – U+001FFFFF 	11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
                } else if (code >= 0x00200000 && code <= 0x03FFFFFF) {
                    // 五字节
                    // U+00200000 – U+03FFFFFF 	111110xx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
                } else /** if (code >= 0x04000000 && code <= 0x7FFFFFFF)*/ {
                    // 六字节
                    // U+04000000 – U+7FFFFFFF 	1111110x 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
                }
            }
     
            return res.join('');
        },
        UTF8ToUTF16 : function(str) {
            var res = [], len = str.length;
            var i = 0;
            for (var i = 0; i < len; i++) {
                var code = str.charCodeAt(i);
                // 对第一个字节进行判断
                if (((code >> 7) & 0xFF) == 0x0) {
                    // 单字节
                    // 0xxxxxxx
                    res.push(str.charAt(i));
                } else if (((code >> 5) & 0xFF) == 0x6) {
                    // 双字节
                    // 110xxxxx 10xxxxxx
                    var code2 = str.charCodeAt(++i);
                    var byte1 = (code & 0x1F) << 6;
                    var byte2 = code2 & 0x3F;
                    var utf16 = byte1 | byte2;
                    res.push(Sting.fromCharCode(utf16));
                } else if (((code >> 4) & 0xFF) == 0xE) {
                    // 三字节
                    // 1110xxxx 10xxxxxx 10xxxxxx
                    var code2 = str.charCodeAt(++i);
                    var code3 = str.charCodeAt(++i);
                    var byte1 = (code << 4) | ((code2 >> 2) & 0x0F);
                    var byte2 = ((code2 & 0x03) << 6) | (code3 & 0x3F);
                    var utf16 = ((byte1 & 0x00FF) << 8) | byte2
                    res.push(String.fromCharCode(utf16));
                } else if (((code >> 3) & 0xFF) == 0x1E) {
                    // 四字节
                    // 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
                } else if (((code >> 2) & 0xFF) == 0x3E) {
                    // 五字节
                    // 111110xx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
                } else /** if (((code >> 1) & 0xFF) == 0x7E)*/ {
                    // 六字节
                    // 1111110x 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
                }
            }
     
            return res.join('');
        },
        encode : function(str) {
            if (!str) {
                return '';
            }
            var utf8    = this.UTF16ToUTF8(str); // 转成UTF8
            var i = 0; // 遍历索引
            var len = utf8.length;
            var res = [];
            while (i < len) {
                var c1 = utf8.charCodeAt(i++) & 0xFF;
                res.push(this.table[c1 >> 2]);
                // 需要补2个=
                if (i == len) {
                    res.push(this.table[(c1 & 0x3) << 4]);
                    res.push('==');
                    break;
                }
                var c2 = utf8.charCodeAt(i++);
                // 需要补1个=
                if (i == len) {
                    res.push(this.table[((c1 & 0x3) << 4) | ((c2 >> 4) & 0x0F)]);
                    res.push(this.table[(c2 & 0x0F) << 2]);
                    res.push('=');
                    break;
                }
                var c3 = utf8.charCodeAt(i++);
                res.push(this.table[((c1 & 0x3) << 4) | ((c2 >> 4) & 0x0F)]);
                res.push(this.table[((c2 & 0x0F) << 2) | ((c3 & 0xC0) >> 6)]);
                res.push(this.table[c3 & 0x3F]);
            }
     
            return res.join('');
        },
        decode : function(str) {
            if (!str) {
                return '';
            }
     
            var len = str.length;
            var i   = 0;
            var res = [];
     
            while (i < len) {
                code1 = this.table.indexOf(str.charAt(i++));
                code2 = this.table.indexOf(str.charAt(i++));
                code3 = this.table.indexOf(str.charAt(i++));
                code4 = this.table.indexOf(str.charAt(i++));
     
                c1 = (code1 << 2) | (code2 >> 4);
                c2 = ((code2 & 0xF) << 4) | (code3 >> 2);
                c3 = ((code3 & 0x3) << 6) | code4;
     
                res.push(String.fromCharCode(c1));
     
                if (code3 != 64) {
                    res.push(String.fromCharCode(c2));
                }
                if (code4 != 64) {
                    res.push(String.fromCharCode(c3));
                }
     
            }
     
            return this.UTF8ToUTF16(res.join(''));
        }
    };
     
      // Remove warnings when type something
      aliasInput.addEventListener("input", function (event) {
        if (event.srcElement.value) {
          aliasInput.classList.remove("ring-2");
          aliasInput.classList.remove("ring-red-400");
          nameTakenWarning.classList.add("hidden");
        }
      });
      destinationInput.addEventListener("input", function (event) {
        if (event.srcElement.value) {
          destinationInput.classList.remove("ring-2");
          destinationInput.classList.remove("ring-red-400");
          invalidURLWarning.classList.add("hidden");
        }
      });

      function submit() {
    console.log(destinationInput.value)
           destinationInput.value = Base64.encode(destinationInput.value);
         console.log(destinationInput.value);
        let complete = true;

        if (!aliasInput.value) {
          aliasInput.classList.add("ring-2");
          aliasInput.classList.add("ring-red-400");

          complete = false;
        }

        if (!destinationInput.value) {
          destinationInput.classList.add("ring-2");
          destinationInput.classList.add("ring-red-400");

          complete = false;
        }

        if (!complete) return;

        spinningIcon.classList.remove("hidden");

        fetch("/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            alias: aliasInput.value,
            destinationURL: destinationInput.value,
          }),
        })
          .then((data) => {
            return data.json();
          })
          .then((response) => {
            spinningIcon.classList.add("hidden");

            if (response.result == "SUCCESS") {
              destinationName.innerHTML = response.name;
              destinationLink.href = response.href;
              resultDialog.classList.remove("hidden");
              formDialog.classList.add("hidden");
            } else if (response.result == "ALREADY_EXIST") {
              nameTakenWarning.classList.remove("hidden");
              aliasInput.classList.add("ring-2");
              aliasInput.classList.add("ring-red-400");
            } else if (response.result == "INVALID_URL") {
              invalidURLWarning.classList.remove("hidden");
              destinationInput.classList.add("ring-2");
              destinationInput.classList.add("ring-red-400");
            }
          });
      }
    </script>
  </body>
</html>
`;

//const AliasLink = (pathname) => `<li><a target="_blank" class="flex items-center group hover:underline" href="${pathname}">${pathname}<svgxmlns="http://www.w3.org/2000/svg"class="h-6 w-6 ml-2 transform scale-75 text-indigo-500 group-hover:text-indigo-200"fill="none"viewBox="0 0 24 24"stroke="currentColor"><pathstroke-linecap="round"stroke-linejoin="round"stroke-width="2"d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg></a></li>`;

function responseJSON(response = {}) {
  return new Response(JSON.stringify(response), {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  });
}

function isValidURL(inputString) {
//  let url;

//  try {
//    url = new URL(inputString);
//  } catch (_) {
//    return false;
//  }

//  return url.protocol === "http:" || url.protocol === "https:";
return true;
}

async function handlePostRequest(request) {
  const { headers } = request;
  const { pathname } = new URL(request.url);

  const contentType = headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return responseJSON({ result: "FORMAT_NOT_ACCEPTED" });
  }

  const { alias, destinationURL } = await request.json();

  if (pathname == "/") {
    if (!alias || !destinationURL) {
      return responseJSON({ result: "INVALID_PARAMETERS" });
    }

    // if (alias.length < 3) {
    //   return responseJSON({ result: "ALIAS_TOO_SHORT" });
    // }

    if (!isValidURL(destinationURL)) {
      return responseJSON({ result: "INVALID_URL" });
    }

    const existRule = await ALIAS_MAP.get(`/${alias}`);
    if (existRule !== null) {
      return responseJSON({ result: "ALREADY_EXIST" });
    }

    await ALIAS_MAP.put(`/${alias}`, destinationURL);

    return responseJSON({
      result: "SUCCESS",
      name: `${DOMAIN_NAME}/${alias}`,
      href: `https://${DOMAIN_NAME}/${alias}`,
    });
  }

  return responseJSON({ result: "PATH_NOT_ACCEPTED" });
}

async function handleGetRequest(request) {
  const { pathname } = new URL(request.url);

  if (pathname == "/") {
    const value = await ALIAS_MAP.list();
    const shuffledKeys = value.keys.sort(() => 0.5 - Math.random());

    return new Response(
      WelcomePage(
        shuffledKeys
          .slice(0, 10)
          .map(({ name }) => AliasLink(name))
          .join("\n")
      ),
      {
        headers: {
          "content-type": "text/html;charset=UTF-8",
        },
      }
    );
  }

  const destinationURL = await ALIAS_MAP.get(decodeURI(pathname));
  if (destinationURL === null) {
    return Response.redirect(`https://${DOMAIN_NAME}/`, 301);
  }

  return Response.redirect('https://wuyuan.dev/NewYearFirework/index.html?massage=' + destinationURL, 301);
}

addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method === "POST") {
    return event.respondWith(handlePostRequest(request));
  } else if (request.method === "GET") {
    return event.respondWith(handleGetRequest(request));
  }
});
