import React, { Component } from 'react';
import Observer from 'react-intersection-observer'
import './default.css';

import { googlefont, common, cssMaker } from '../../../util'

import VariantsRadio from '../VariantsRadio'


class GoogleFontItem extends Component {

    constructor (props) {
        super(props);

        const firstVariant = this.props.fontObj.variants[0]
        this.state = {
            fontObj: this.props.fontObj,
            fontSize: 40,
            isItalic : firstVariant.includes('italic'),
            fontWeight: firstVariant
        }
    }

    getFontFamilyString = () => {
        const variants = this.state.fontObj.variants.map((v) => {
            v = v.replace(/regular/, '400');
            v = v.replace(/italic/, 'i');

            if (v === 'i') {
                v = '400i';
            }

            return v; 
        })
        return [this.state.fontObj.family.replace(/ /, '+'), variants].join(":");
    }

    loadFontCss = (inView) => {
        if (inView) {
            const csspath = "https://fonts.googleapis.com/css?family=" + this.getFontFamilyString()

            cssMaker.loadCss({ csspath })
            
        }
    }    

    changeFontSize = (e) => {
        const fontSize = parseInt(e.target.value, 10);
        this.setState({ fontSize })
    }

    changeVariants = (index) => {
        const v = this.state.fontObj.variants[index];

        const isItalic = v.includes('italic');

        const fontWeight = v.replace(/italic/, '').replace(/regular/, '400');

        this.setState({
            isItalic,
            fontWeight
        })
    }

    downloadGoogleFont = (e)  => {
        // 중복 체크 
        // 구글 폰트 모두 다운로드 
        let node = e.target.querySelector('.material-icons');
        node.textContent = "autorenew"
        node.classList.add('spin')

        googlefont.downloadGoogleFont(this.state.fontObj, () => {
            console.log(' google font done');
            node.textContent = "font_download"
            node.classList.remove('spin')
        });

    }

    goUrl = (link, name) => {
        return () => {
            window.open(link, name || '_link');
        }
    }    
   
    render () {
           
        // 기타 다른 폰트들에 대해서 Rendering 객체를 다르게 해야할 것 같다. 
        const fontObj = this.state.fontObj; 
        const name = fontObj.name || fontObj.family;
        const labels = fontObj.variants || [];
        const previewUrl = "https://fonts.google.com/specimen/" + encodeURIComponent(fontObj.family)

        const style = Object.assign({ 
            fontSize : this.state.fontSize + 'px' ,
            fontFamily : `'${fontObj.family}', sans-serif, serif`,
            fontWeight: this.state.fontWeight,
            fontStyle : (this.state.isItalic ? 'italic' : ''),
        });

        let message = common.getPangramMessage('en'); 

        return (
            <Observer className="google-font-item" onChange={inView => this.loadFontCss(inView)}>
                <div className="font-info">
                    <div className="font-family" title={fontObj.family} onClick={this.goUrl(previewUrl, 'Preview')} >
                        <i className="material-icons">cloud</i> {name}  <span className="category">{fontObj.category}</span>
                    </div>
                </div> 
                <div className="tools">
                    <span className="link" title="All Font Download" onClick={this.downloadGoogleFont} ><i className="material-icons">font_download</i></span>
                    <span className="link" title="View Font" onClick={this.goUrl(previewUrl, 'Preview')} ><i className="material-icons">pageview</i></span>
                </div>   
                <div className="font-item-preview" style={style} title="Click If write a text">
                    <div ref="message" className="message" contentEditable={true} dangerouslySetInnerHTML={{__html : message}} />
                </div>                
                <VariantsRadio labels={labels} onChange={this.changeVariants} />
                <div className="toolbar">
                    <input type="range" max="250" min="10" defaultValue={this.state.fontSize} onChange={this.changeFontSize} />
                </div>                                
            </Observer>
        )
    }
 
}

export default GoogleFontItem 