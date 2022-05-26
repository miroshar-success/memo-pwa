/**
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

// DO NOT EDIT THIS GENERATED OUTPUT DIRECTLY!
// This file should be overwritten as part of your build process.
// If you need to extend the behavior of the generated service worker, the best approach is to write
// additional code and include it using the importScripts option:
//   https://github.com/GoogleChrome/sw-precache#importscripts-arraystring
//
// Alternatively, it's possible to make changes to the underlying template file and then use that as the
// new base for generating output, via the templateFilePath option:
//   https://github.com/GoogleChrome/sw-precache#templatefilepath-string
//
// If you go that route, make sure that whenever you update your sw-precache dependency, you reconcile any
// changes made to this original template file with your modified copy.

// This generated service worker JavaScript will precache your site's resources.
// The code needs to be saved in a .js file at the top-level of your site, and registered
// from your pages in order to be used. See
// https://github.com/googlechrome/sw-precache/blob/master/demo/app/js/service-worker-registration.js
// for an example of how you can register this script and handle various service worker events.

/* eslint-env worker, serviceworker */
/* eslint-disable indent, no-unused-vars, no-multiple-empty-lines, max-nested-callbacks, space-before-function-paren, quotes, comma-spacing */
'use strict';

var precacheConfig = [["2wayauthentication.html","b288d10986269fb93525276828be57a3"],["advancedsettings.html","e2b041b16843e7830689e8b39db6e4cc"],["audittrail.html","9dbd9e57c9b8e50ffe5067d9f3bfedd3"],["css/font-awesome.min.css","269550530cc127b6aa5a35925a7de6ce"],["css/main.css","626a0de6fd79edc1d76c4f172b93b9df"],["css/main_r.css","04577c7077de3d53c8a1bf29a76d0ea1"],["deviceinfo.html","e9e2dfd1bf804bf5f1786af95e9591ab"],["erasekeys.html","9d3198a0e69b7a4db598d434c389e304"],["favicon.ico","0f2a8db7df4ac157f704a14eedfdb69e"],["icon/hello-icon-128.png","edf5f2e3398d419dd456bdced0ea31c7"],["icon/hello-icon-144.png","e31cc84f888a8d655f7a2ababacd94ea"],["icon/hello-icon-152.png","26dc1a0d5ea91bdedf9d2e6b1bc3f05b"],["icon/hello-icon-192.png","974216cab6914ff448d679070b0d1f8c"],["icon/hello-icon-256.png","2714bdf0eab3c94d043aa14029d99dd6"],["icon/hello-icon-512.png","493e1b9fcb8f4ba5fce63f4592551a0a"],["img/2way-authentication.svg","18515f4fa2595a412e0d8f83f6e5e06b"],["img/activate-card.svg","75341dd683763a5a245fc6489096d3ef"],["img/activate-card2.svg","2937ae59af9a0ef93d33ae37e8326951"],["img/activated-card-list.svg","5e0f1dd440cbb81867357604f4b2e99e"],["img/add-key-owner.svg","3e7fc4225ea9b262437176de81317cea"],["img/advset-icon-colour.svg","b3cce3d66f7486d57773400486defdf0"],["img/advset-icon.svg","a7394a1cf116dea6c74d9513fb5a5bb0"],["img/arrow-down-white.svg","5a1e4cd143c4ed649398de2d278abc6f"],["img/arrow-left-white.svg","ca727223bdb30b97d72931a1f0fecef0"],["img/attention-icon.svg","2d3335464c53559214c42482d32b9ec9"],["img/auditlist-icon-colour.svg","756ca151321e67e729956acdc75dc175"],["img/auditlist-icon.svg","42d0c031847aecb2445f92182d1c971b"],["img/check.svg","45aef0a1e14e4e35ea9822414da5aabe"],["img/close-icon.svg","4570eec72a09d3e3e70656aef2fd2c1b"],["img/delete-icon-red.svg","8ba99d37676fd56624ecead9a2a5431e"],["img/delete-icon.svg","584c29e1287cd6f38ca5c5ad7987cf34"],["img/disconnect-icon.svg","b949f9381a93333e31e3fbcd270761bc"],["img/dropdown-icon.svg","2bb17fd886e53a8b4178ecc8060835b8"],["img/erase-cards.svg","3d3f25c5a381be0e322abb6b48e5c651"],["img/gradient-circle.svg","701b5ca13a5ec3ed3f376cd9862ddb10"],["img/index-logo.svg","7cb6e988f40bba81ca451fbba11f4ae8"],["img/inf-reset-btn.svg","f8e125cad02066c032295c11e946db10"],["img/intrusion-alarm.svg","e799dd15fa7438c51e9ec78b42be67c6"],["img/keymng-icon-colour.svg","a16152132f63d036dfe293a53e4f4ccb"],["img/keymng-icon.svg","99ba52857707fc7a5697547d7b9664c7"],["img/left-arrow.svg","5bba883cdce1bfeee2fc18ea58ee2313"],["img/logo-text.svg","c7ba2d222cf51e94ddb95f989aa8f839"],["img/logo.svg","efe285b67071c4eddbeb1769656f0251"],["img/open-door-warning.svg","ddbe095ceb6164757f65c19a1fe4d210"],["img/openfeat-icon-colour.svg","b2571451de91817e4b3c31bf762f7cb8"],["img/openfeat-icon.svg","db0089c5d08de24a49b32eef7a20516a"],["img/opening-basic-mode.svg","b3121dd308167049c2d9ba2aba602d35"],["img/opening-delay.svg","8fc11560a7297c05e133fc44b5be54f7"],["img/opening-normal-mode.svg","83772dc4d7b4fd979a38570f3d3966bd"],["img/opening-security-mode.svg","dc969de0c489e637330e9c65b7bb2da0"],["img/plus-icon.svg","273c1230c8340a82a445d8a12df83449"],["img/present-card.svg","b8856b1763d19e5f444877a1d14a56d4"],["img/question-icon.svg","ab831e6c57b964aa27b4a2cded7a0a55"],["img/reset-icon.svg","472b805a20622e6ff38825b771c71815"],["img/right-arrow.svg","68abec7b4b5b8df6b1df14c8d93934f6"],["img/splashscreen-logo.svg","7ffa606e0e055429e2d4e245f88d95c1"],["img/stepper-1.svg","d1c4bfdb1d229028398b327a18df13c7"],["img/stepper-2.svg","621fa9cdd62d00ad9549109c5b8b185c"],["img/stepper-3.svg","d7976432c19e1a326314d6817e55f551"],["img/stepper-4.svg","646bb2054e17a6a82485f81277f42c56"],["img/stepper1-3.svg","f024a4db656d776305b0bc359fdcf46a"],["img/stepper2-3.svg","48f482ef9f808a32d7d4cb9abd7ea10d"],["img/stepper3-3.svg","892feb108033c654f808cb8555027aba"],["img/successful-programmed.svg","4fe42e066f3333098f2eff13213610a7"],["img/time-expired.svg","6710e76785f82366ebed0fc1395bdf07"],["img/update-icon-colour.svg","92f90a0dd50d3606fcfb6f5b647a6c3b"],["img/update-icon.svg","9ac816eb4e9cde00eb490dfeb2142d6e"],["img/validation-mode.svg","926bdb0543050fd5ba744386311ef9d5"],["index.html","8d7587810cd6b1e6a3ac50ec883a5c12"],["intrusionalarm.html","7f716f7fa821f4dd9ef39d7c81c6bd7f"],["js/advancedsettings-js.js","b87eaa331ca0bc55a93bbc81ea57da73"],["js/audittrail-js.js","d14e18c92ffa4c1aab40a5b8f351b795"],["js/device-list.js","b4121063883887a03d04a37b93690bf0"],["js/deviceinfo-js.js","523897ff106b0ff28dec78b7263bf89f"],["js/erasekeys-js.js","e3ac4ea73311016ae8c3230afbb84331"],["js/indexpage.js","37b32beda7784f6255a628de4d35278b"],["js/javascript.js","be6ab820240829b407fb8f5139fad1b6"],["js/jquery-3.6.0.min.js","8fb8fee4fcc3cc86ff6c724154c49c42"],["js/jquery-3.6.0.min_r.js","8fb8fee4fcc3cc86ff6c724154c49c42"],["js/keylist-js.js","19a0f6ff9fe0cecea605c5024601f16f"],["js/login-js.js","da84da56cd4306c7d77f90b80746115a"],["js/main.js","b7a7c0e77e2b2481141efae11bb6a00f"],["js/memory_keys.js","c8e5f5c96249317a44a095b6e6c19c8a"],["js/newpassword-js.js","c1004c0f68214fca39060895058701f5"],["js/notification-popup.js","954fc089363df47565386d01f0fd5fbb"],["js/ofeatures-js.js","f50effe8a578d48a32771620cc430524"],["js/prebid-ads.js","8a68886c66c8ca4dccac563705f5891c"],["js/programkeys-js.js","18ce131bcf4f2c49a5ba32da158bd9e4"],["js/register-js.js","84f9c0bceb9da1c2239c267af17f2b71"],["js/reset-pass.js","5722d9f32746f0fb15fade5c3a42107d"],["js/resetpassword-js.js","d41d8cd98f00b204e9800998ecf8427e"],["js/signup-js.js","8e9533d56bf27e797288394fb55ac129"],["js/splashscreen-js.js","f5363f04f25ed1574d952130b4baaee4"],["js/updatedev-js.js","d0076030c1ffeee960f5ee15cc787a2b"],["js/updatedev-js_r.js","92a1f34fad4f587e990935cc29755718"],["keylistpage.html","70422173df54762ab0d961493f0fa783"],["login.html","6bc839d73e1b5ad10ceede653c371d04"],["manifest.json","89255b340343c6cb7874542c28fe5613"],["newpassword.html","cea6f677eeb84f24ca4db07a6632557a"],["opendoorwarning.html","1cf0c41d7ae18d699557ad5f643a364b"],["openingdelay.html","451c7d7067a649c711c3f5014826a56c"],["openingfeat.html","eab90a8c4390842755a80a7fefc1adde"],["programkeys.html","c168538015ad7331be055963bf1ba18f"],["pulsemode.html","758b660a8ae3bf438f6bc7e89502f715"],["register.html","7968b48f3b0191b560d28a45f4eee261"],["resetbtn.html","57ce13500c77c3a6f8de3c7e238d8313"],["resetcrd.html","87f374b56ed3bed8062b78a8193e8782"],["resetpass.html","503813e083160429e7fae70630f1d132"],["securitymode.html","da1d2e5f9484a7bb6d9bd19f198b22b4"],["signup-first-time.html","23e28b8e018588fd6530ffb44389a3ad"],["splashscreen.html","55cd9d27147cb1da95e3f86c9fa408ee"],["successfulprog.html","e4c8c71649b7449e845964daccd721fb"],["text/useracclist.txt","3a89b1bbb444fcc6fd7c35296d5b374f"],["text/userlist.txt","d41d8cd98f00b204e9800998ecf8427e"],["text/usersettings.txt","8d421cdc1a1b7f1f9ea6eb8100c7540a"],["updatedev.html","5f8ff0d783e64d910a1a15557677c4e7"],["updatedev_r.html","f3b2b6bc8e355c2de14db22f3d1b3125"],["validationmode.html","078f40e44770a7fba5f685711d4a3531"],["watchmakermode.html","f81de0ee143ba9675fb7c233c2d70d42"]];
var cacheName = 'sw-precache-v3-sw-precache-' + (self.registration ? self.registration.scope : '');


var ignoreUrlParametersMatching = [/^utm_/];



var addDirectoryIndex = function(originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
      url.pathname += index;
    }
    return url.toString();
  };

var cleanResponse = function(originalResponse) {
    // If this is not a redirected response, then we don't have to do anything.
    if (!originalResponse.redirected) {
      return Promise.resolve(originalResponse);
    }

    // Firefox 50 and below doesn't support the Response.body stream, so we may
    // need to read the entire body to memory as a Blob.
    var bodyPromise = 'body' in originalResponse ?
      Promise.resolve(originalResponse.body) :
      originalResponse.blob();

    return bodyPromise.then(function(body) {
      // new Response() is happy when passed either a stream or a Blob.
      return new Response(body, {
        headers: originalResponse.headers,
        status: originalResponse.status,
        statusText: originalResponse.statusText
      });
    });
  };

var createCacheKey = function(originalUrl, paramName, paramValue,
                           dontCacheBustUrlsMatching) {
    // Create a new URL object to avoid modifying originalUrl.
    var url = new URL(originalUrl);

    // If dontCacheBustUrlsMatching is not set, or if we don't have a match,
    // then add in the extra cache-busting URL parameter.
    if (!dontCacheBustUrlsMatching ||
        !(url.pathname.match(dontCacheBustUrlsMatching))) {
      url.search += (url.search ? '&' : '') +
        encodeURIComponent(paramName) + '=' + encodeURIComponent(paramValue);
    }

    return url.toString();
  };

var isPathWhitelisted = function(whitelist, absoluteUrlString) {
    // If the whitelist is empty, then consider all URLs to be whitelisted.
    if (whitelist.length === 0) {
      return true;
    }

    // Otherwise compare each path regex to the path of the URL passed in.
    var path = (new URL(absoluteUrlString)).pathname;
    return whitelist.some(function(whitelistedPathRegex) {
      return path.match(whitelistedPathRegex);
    });
  };

var stripIgnoredUrlParameters = function(originalUrl,
    ignoreUrlParametersMatching) {
    var url = new URL(originalUrl);
    // Remove the hash; see https://github.com/GoogleChrome/sw-precache/issues/290
    url.hash = '';

    url.search = url.search.slice(1) // Exclude initial '?'
      .split('&') // Split into an array of 'key=value' strings
      .map(function(kv) {
        return kv.split('='); // Split each 'key=value' string into a [key, value] array
      })
      .filter(function(kv) {
        return ignoreUrlParametersMatching.every(function(ignoredRegex) {
          return !ignoredRegex.test(kv[0]); // Return true iff the key doesn't match any of the regexes.
        });
      })
      .map(function(kv) {
        return kv.join('='); // Join each [key, value] array into a 'key=value' string
      })
      .join('&'); // Join the array of 'key=value' strings into a string with '&' in between each

    return url.toString();
  };


var hashParamName = '_sw-precache';
var urlsToCacheKeys = new Map(
  precacheConfig.map(function(item) {
    var relativeUrl = item[0];
    var hash = item[1];
    var absoluteUrl = new URL(relativeUrl, self.location);
    var cacheKey = createCacheKey(absoluteUrl, hashParamName, hash, false);
    return [absoluteUrl.toString(), cacheKey];
  })
);

function setOfCachedUrls(cache) {
  return cache.keys().then(function(requests) {
    return requests.map(function(request) {
      return request.url;
    });
  }).then(function(urls) {
    return new Set(urls);
  });
}

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return setOfCachedUrls(cache).then(function(cachedUrls) {
        return Promise.all(
          Array.from(urlsToCacheKeys.values()).map(function(cacheKey) {
            // If we don't have a key matching url in the cache already, add it.
            if (!cachedUrls.has(cacheKey)) {
              var request = new Request(cacheKey, {credentials: 'same-origin'});
              return fetch(request).then(function(response) {
                // Bail out of installation unless we get back a 200 OK for
                // every request.
                if (!response.ok) {
                  throw new Error('Request for ' + cacheKey + ' returned a ' +
                    'response with status ' + response.status);
                }

                return cleanResponse(response).then(function(responseToCache) {
                  return cache.put(cacheKey, responseToCache);
                });
              });
            }
          })
        );
      });
    }).then(function() {
      
      // Force the SW to transition from installing -> active state
      return self.skipWaiting();
      
    })
  );
});

self.addEventListener('activate', function(event) {
  var setOfExpectedUrls = new Set(urlsToCacheKeys.values());

  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.keys().then(function(existingRequests) {
        return Promise.all(
          existingRequests.map(function(existingRequest) {
            if (!setOfExpectedUrls.has(existingRequest.url)) {
              return cache.delete(existingRequest);
            }
          })
        );
      });
    }).then(function() {
      
      return self.clients.claim();
      
    })
  );
});


self.addEventListener('fetch', function(event) {
  if (event.request.method === 'GET') {
    // Should we call event.respondWith() inside this fetch event handler?
    // This needs to be determined synchronously, which will give other fetch
    // handlers a chance to handle the request if need be.
    var shouldRespond;

    // First, remove all the ignored parameters and hash fragment, and see if we
    // have that URL in our cache. If so, great! shouldRespond will be true.
    var url = stripIgnoredUrlParameters(event.request.url, ignoreUrlParametersMatching);
    shouldRespond = urlsToCacheKeys.has(url);

    // If shouldRespond is false, check again, this time with 'index.html'
    // (or whatever the directoryIndex option is set to) at the end.
    var directoryIndex = 'index.html';
    if (!shouldRespond && directoryIndex) {
      url = addDirectoryIndex(url, directoryIndex);
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond is still false, check to see if this is a navigation
    // request, and if so, whether the URL matches navigateFallbackWhitelist.
    var navigateFallback = '';
    if (!shouldRespond &&
        navigateFallback &&
        (event.request.mode === 'navigate') &&
        isPathWhitelisted([], event.request.url)) {
      url = new URL(navigateFallback, self.location).toString();
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond was set to true at any point, then call
    // event.respondWith(), using the appropriate cache key.
    if (shouldRespond) {
      event.respondWith(
        caches.open(cacheName).then(function(cache) {
          return cache.match(urlsToCacheKeys.get(url)).then(function(response) {
            if (response) {
              return response;
            }
            throw Error('The cached response that was expected is missing.');
          });
        }).catch(function(e) {
          // Fall back to just fetch()ing the request if some unexpected error
          // prevented the cached response from being valid.
          console.warn('Couldn\'t serve response for "%s" from cache: %O', event.request.url, e);
          return fetch(event.request);
        })
      );
    }
  }
});







