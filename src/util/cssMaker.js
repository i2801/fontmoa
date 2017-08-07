import common from './common'

const fs = window.require('fs');
const path = window.require('path');
const Datauri = window.require('datauri');

const datauri = new Datauri();

const changeExt = (file, ext) => {
    let arr = file.split(".");
    arr[arr.length-1] = ext;

    return arr.join('.');
}

const createCssDir = (dirname) => {
    dirname.split(path.sep).reduce((prevDir, dir, index, array) => {
        const temppath = path.resolve(prevDir, dir);
        if (fs.existsSync(temppath)) {
            // NOOP 
        } else {
            fs.mkdirSync(temppath, 0o777);
        }
        return temppath;
    }, '');
}

/**
 * font css 를 생성한다. 
 * css 파일을 매번 갱신해야할 필요가 있을까?  data uri 형태로 만들어도 될까? 
 * react 에서 css 가 변경되면 자동으로 새로 컴파일 되버려서 화면을 리로드 해버린다. 
 * css 를 datauri 형태로 바꾸자. 
 * 
 * @param {*} realpath 
 * @param {*} font 
 */
const createFontCss = (realpath, font) => {
    const obj = path.parse(realpath);

    let cssname = changeExt(obj.base, 'css');

    const startdir = obj.dir.replace(obj.root, '');

    const cssdir = path.join('css', './' + startdir);
    const fontdir = path.join('fonts', './' + startdir);
    const csspath = path.resolve(path.join('data', cssdir), cssname);
    const fontpath = path.resolve(path.join('data', fontdir), obj.base);    

    createCssDir(path.join('data', cssdir));
    createCssDir(path.join('data', fontdir));

    const ext = obj.ext.split('.').pop();

    let fonttype = 'truetype';

    switch(ext) {
        case 'ttf': fonttype = 'truetype'; break; 
        case 'otf': fonttype = 'opentype'; break; 
        case 'woff': fonttype = 'woff'; break;         
        default: break; 
    }

    const fontFamily = font.familyName;

    const css_fontpath = path.join(fontdir, path.sep, obj.base).replace(/\\/g, '/');

    const data = `@font-face { font-family: '${fontFamily}'; src: url('${common.PROTOCOL_PREFIX}://${escape(css_fontpath)}') format('${fonttype}'); }`;
    fs.writeFileSync(csspath, data);
    if (!fs.existsSync(fontpath)) { // 이미 생성되어 있으면 다시 생성하지 않음. 
        fs.writeFileSync(fontpath, fs.readFileSync(realpath));
    }

    datauri.format('.css', data);

//    shell.openItem(fontpath);

    return {
        csspath : common.PROTOCOL_PREFIX + '://' + path.join(cssdir, cssname).replace(/\\/g, '/'),
        fontpath : path.join(fontdir, obj.base),
        fontFamily,
        realpath,
        fonttype
    }
}

export default {
    createFontCss
}