import React, { Component } from 'react';
import './default.css';
import LabelInput from '../LabelInput'
import { font } from '../../../util'

/**
 * Free Font Item View 
 * 
 * @see README.md  in resources/fonts
 * 
 */
class FreeFontItem extends Component {

    constructor (props) {
        super(props);
        this.state = {
            fontObj: this.props.fontObj,
        }
    }

    
    toggleDescription = (e) => {
        this.refs.description.classList.toggle('open');
    }

    
    downloadUrl = (link) => {
        // 구글 early access 폰트, zip 파일로 압축된 폰트 다운로드 
        // 중복 체크         
        return (e) => {
            let node = e.target.querySelector('.material-icons');
            node.textContent = "autorenew"
            node.classList.add('spin')

            font.downloadFile(link, () => {
                console.log('done');
                node.textContent = "font_download"
                node.classList.remove('spin')                
            });
        }
    }

    goUrl = (link, name) => {
        return () => {
            window.open(link, name || '_link');
        }
    }    

    getLicense = (fontObj) => {
        if (fontObj.license) {
            return <div className="desc-item"> {fontObj.license} - {fontObj.licenseDescription}</div>
        }

        return "";
    }

    getFontTitle = () => {
        const fontObj = this.state.fontObj; 

        let icon = "";
        
        if (fontObj.icon) {
            icon = <i key={0} className="material-icons">{fontObj.icon}</i> ;
        } else if (fontObj.iconImageUrl) {
            icon = <img key={1} alt="icon" src={fontObj.iconImageUrl} className="icon-image" />;
        } else {
            icon = <i key={2} className="material-icons">card_giftcard</i> ;
        }

        const linkText = [icon, <span key={4}>{fontObj.family} - {fontObj.name}</span>]

        if (fontObj.link) {
            return <a className="link" href={fontObj.link} target="_font_link">{linkText}</a>
        } else {
            return linkText
        }

    }
   
    render () {
           
        const fontObj = this.state.fontObj; 
        const preview = {__html : fontObj.description || ""}


        return (
            <div className="free-font-item">
                <div className="font-info">
                    <div className="font-family" title={fontObj.family}>
                        {this.getFontTitle()}                        
                    </div>
                </div> 
                <div className="tools">
                    {fontObj.license ? <span onClick={this.toggleDescription} title="Open Description"><i className="material-icons">apps</i></span> : "" }
                    {fontObj.downloadUrl ? <span className="link" title="Font Download" onClick={this.downloadUrl(fontObj.downloadUrl)} ><i className="material-icons">font_download</i></span> : ""}
                    {fontObj.licenseUrl ? <span className="link" title="View License" onClick={this.goUrl(fontObj.licenseUrl, 'License')} ><i className="material-icons">turned_in_not</i></span> : ""}
                    {fontObj.buyUrl ? <span className="link" onClick={this.goUrl(fontObj.buyUrl, 'Buy')} ><i className="material-icons">shopping_cart</i></span> : ""}
                </div>   
                <div ref="description" className="font-description" title="Font Description"> 
                    {this.getLicense(fontObj)}
                </div>       
                <div className="preview-image">
                    {fontObj.previewImage ? <img src={encodeURIComponent(fontObj.previewImage)} alt="Preview Font" /> : ""}
                </div>                         
                <div className="font-item-preview">
                    <div dangerouslySetInnerHTML={preview} />
                </div>
                <LabelInput fontObj={fontObj} labels={fontObj.labels} readonly={true}/>        
            </div>
        )
    }
 
}

export default FreeFontItem