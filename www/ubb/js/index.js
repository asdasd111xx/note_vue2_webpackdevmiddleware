(function () {
    $(function GeneratorQRCode() {
        new QRCode($('.qr-code .qr-code-img').get(0), {
            text: location.href + '/../download/index.html',
            width: 125,
            height: 125,
            correctLevel: QRCode.CorrectLevel.M
        });
    });
    $(function SetDownloadButtonLink() {
        var MOBILE_WIDTH = 768;
        var WEB_DOWNLOAD_LINK = 'https://ub.xf0371.com/UB/UB-Launcher.exe';
        var ANDROID_DOWNLOAD_LINK = 'http://ub.xf0371.com/UB/Android/UniverseBrowser.apk';
        var IOS_DOWNLOAD_LINK = 'http://itunes.apple.com/app/%E5%AF%B0%E5%AE%87%E6%B5%8F%E8%A7%88%E5%99%A8/id1109296472';
        var $downloadButtonLink = $('.download-btn a');

        function isMobileWidth() {
            if ($(window).width() <= MOBILE_WIDTH) {
                return true;
            }
            return false;
        }

        function isiOSDevice() {
            var userAgent = window.navigator.userAgent;
            var regex = /(ipod|iphone|ipad)/i;
            return regex.test(userAgent);
        }

        $(window).on('load resize', function () {
            if (isMobileWidth()) {
                if (isiOSDevice()) {
                    $downloadButtonLink.attr('href', IOS_DOWNLOAD_LINK);
                } else {
                    $downloadButtonLink.attr('href', ANDROID_DOWNLOAD_LINK);
                }
            } else {
                $downloadButtonLink.attr('href', WEB_DOWNLOAD_LINK);
            }
        });
    });
    $(function bindDownloadButtonClickGA() {
        $('.download-btn a').click(function () {
            var downloadUrl = $(this).attr('href');
            ga('send', 'event', 'Link', 'Click', downloadUrl);
        });
    });
    $(function i18n() {
        var languageLib = {
            zh_cn: {
                title: '寰宇浏览器',
                subTitle: '哪里都能去！',
                qrCodeText: '[ 扫描下载手机板 ]',
                fastTitle: '浏览速度更快',
                fastSubTitle: '寰宇独家线路加速技术',
                safetyTitle: '最佳的安全性',
                safetySubTitle: '保护您远离危险',
                privacyTitle: '最高级别的隐私保护',
                privacySubTitle: '免设置，隐私不外露'
            },
            zh_tw: {
                title: '寰宇瀏覽器',
                subTitle: '哪裡都能去！',
                qrCodeText: '[ 掃描下載手機板 ]',
                fastTitle: '瀏覽速度更快',
                fastSubTitle: '寰宇獨家線路加速技術',
                safetyTitle: '最佳的安全性',
                safetySubTitle: '保護您遠離危險',
                privacyTitle: '最高級別的隱私保護',
                privacySubTitle: '免設置，隱私不外露'
            },
            en: {
                title: 'BROWSER UNIVERSE',
                subTitle: 'Can bring you to everywhere！',
                qrCodeText: '[ Download APP ]',
                fastTitle: 'Fastest Browser',
                fastSubTitle: 'Use unique technology to improve the internet speed.',
                safetyTitle: 'Best Secure',
                safetySubTitle: 'Keep you away from danger.',
                privacyTitle: 'Most Private',
                privacySubTitle: 'Simple settings to avoid privacy leaks.'
            }
        };

        var i18n = (function () {
            var lang = '';
            var langLib = {};

            return {
                setLanguage: function (language, lib) {
                    lang = language;
                    langLib = lib;
                },
                translate: function (key) {
                    var currentLangObject = langLib[lang];
                    for (var langKey in currentLangObject) {
                        if (langKey === key) {
                            return currentLangObject[langKey];
                        }
                    }
                    return '';
                }
            };
        })();

        function setLanguageDropdownTextByKey(languageKey) {
            var languageText = $('#' + languageKey).text();
            $(".lang-title").text(languageText);
        }

        function setBodyLanguageAttributeByKey(languageKey) {
            $(".mainBody").attr('name', languageKey);
        }

        function setSelectedLanguageToLocalStorage(selectedLanguage) {
            localStorage.setItem('selectedLanguage', selectedLanguage);
        }

        function getSelectedLanguageFromLocalStorage() {
            return localStorage.getItem('selectedLanguage');
        }

        function changeLanguage(lang) {
            i18n.setLanguage(lang, languageLib);

            $('.info-title').text(i18n.translate('title'));
            $('.info-subtitle').text(i18n.translate('subTitle'));
            $('.qr-code p').text(i18n.translate('qrCodeText'));
            $('.fast .benefit-title').text(i18n.translate('fastTitle'));
            $('.fast .benefit-subtitle').text(i18n.translate('fastSubTitle'));
            $('.safety .benefit-title').text(i18n.translate('safetyTitle'));
            $('.safety .benefit-subtitle').text(i18n.translate('safetySubTitle'));
            $('.privacy .benefit-title').text(i18n.translate('privacyTitle'));
            $('.privacy .benefit-subtitle').text(i18n.translate('privacySubTitle'));
        }

        function handleLanguageChange(languageKey) {
            setLanguageDropdownTextByKey(languageKey);
            setBodyLanguageAttributeByKey(languageKey);
            changeLanguage(languageKey);
        }

        function setDefaultLanguageByUserBrowserLanguage() {
            var selectedLanguage = getSelectedLanguageFromLocalStorage();
            var userBrowserLanguage = selectedLanguage || window.navigator.language || window.navigator.userLanguage || 'zh';
            var lowercaseUserBrowserLanguage = userBrowserLanguage.toLocaleLowerCase()
            var isChineseLanguage = lowercaseUserBrowserLanguage.indexOf('zh') !== -1;
            var isTraditionalChineseLanguage = isChineseLanguage && lowercaseUserBrowserLanguage.indexOf('tw') !== -1;
            var isEnglishLanguage = lowercaseUserBrowserLanguage.indexOf('en') !== -1;

            if (isEnglishLanguage) {
                handleLanguageChange('en');
                return;
            }

            if (isChineseLanguage) {
                if (isTraditionalChineseLanguage) {
                    handleLanguageChange('zh_tw');
                    return;
                }
                handleLanguageChange('zh_cn');
                return;
            }
        }

        $(function () {
            $(".lang-title").click(function () {
                $(".lang-group").slideToggle(300);
                $(this).toggleClass('lang-slide');
            });
            $(".lang-group a").click(function () {
                $(".lang-group").slideToggle(300);
                $(".lang-title").removeClass('lang-slide');

                var selectedLanguage = $(this).attr('id');
                handleLanguageChange(selectedLanguage);
                setSelectedLanguageToLocalStorage(selectedLanguage);
            });
            setDefaultLanguageByUserBrowserLanguage();
        });
    });
}());