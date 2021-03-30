import React, {Component} from "react"
import { connect } from "react-redux"
import { translate } from "react-i18next"

import { Col } from "../../../components/Grid"
import Certificate from "../../../components/Certificate"

import { dateToString } from "../../../utils"

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

class Certificates extends Component {

  constructor() {
    super()

    this.state = {
      isCrtPrinting: false,
      topicname: null,
      modulesNames: [],
      topicdate: null
    }

    this.doCrtPrint = this.doCrtPrint.bind(this)
    this.closeCrtPrint = this.closeCrtPrint.bind(this)
  }

  doCrtPrint(e) {
    e.persist();
    let topicname = e.target.getAttribute('data-title')
    let topicdate = e.target.getAttribute('data-date')
    let modulesNames = e.target.getAttribute('data-modules')
    modulesNames = modulesNames.split(',')
    this.setState(prevState => {
      return {
        ...prevState,
        isCrtPrinting: true,
        topicname: topicname,
        modulesNames: modulesNames,
        topicdate: topicdate
      }
    })

    const input = document.getElementById('crt-print');
    setTimeout(function () {
      html2canvas(input, { scale: 2, width: 690, height: 1120, scrollX: 0, scrollY: 0 }).then(canvas => {
        var context = canvas.getContext('2d');
        context.webkitImageSmoothingEnabled = false;
        context.mozImageSmoothingEnabled = false;
        context.imageSmoothingEnabled = false;
        context.scale(2, 2);
        context["imageSmoothingEnabled"] = false;
        context["mozImageSmoothingEnabled"] = false
        context["oImageSmoothingEnabled"] = false
        context["webkitImageSmoothingEnabled"] = false
        context["msImageSmoothingEnabled"] = false
        const dataURL = canvas.toDataURL('image/png', 1)
        const pdf = new jsPDF("p", "mm", "a4", true);
        let marginLeft = 13;
        let marginRight = 0;
        pdf.internal.scaleFactor = 5.7;

        pdf.addImage(dataURL, 'PNG', marginLeft, marginRight, '', '', '', 'FAST')
        pdf.save('SIMPLICITY-ZERTIFIKAT-' + topicname.replace(/\s/g, '-').toUpperCase() + topicdate + '.pdf')
      })
    }, 1000);

    let self = this;
    setTimeout(function () {
      self.setState(prevState => {
        return {
          ...prevState,
          isCrtPrinting: false,
          topicname: null,
          modulesNames: [],
          topicdate: null
        }
      })
    }, 3000);
  }
  closeCrtPrint() {
    this.setState(prevState => {
      return {
        ...prevState,
        isCrtPrinting: false
      }
    })
  }

  renderCompletedTopics() {
    const { completed_topics, lang } = this.props
    if (completed_topics === undefined) {
      return null
    }
    return completed_topics.map((item, _index) => {
      const topicModules = []
      // eslint-disable-next-line
      item.modules.map((module, i) => {
        topicModules.push(module.name)
      })
      return (
        <li key={_index}>
          <span className="date">{dateToString(item.completed_at, lang, ' | ')}</span>
          <span className="title">{item.name}</span>
          <a data-title={item.name} data-modules={topicModules} data-date={dateToString(item.completed_at, lang, ' | ')} onClick={(e) => this.doCrtPrint(e)}>
            <i className="icon icon-cert-download" />
          </a>
        </li>
      )
    })
  }

  render() {
    const { t} = this.props
    
    return (
      <Col lg={8} className="certificates">
        <Certificate username={this.props.username} topicname={this.state.topicname} modulesNames={this.state.modulesNames} currentDate={this.state.topicdate} isCrtPrinting={this.state.isCrtPrinting} closeCrtPrint={this.closeCrtPrint} />
        <div className="card">
          <div className="intro-block">
            <h3 className="headline">{t("Meine Zertifikate")}</h3>
            <p>{t("Deine in der Akademie erworbenen Zertifikate stehen dir hier zum Download bereit.")}</p>
          </div>
          <div className="info-block">
            <ol>
              {this.renderCompletedTopics()}
            </ol>
          </div>
        </div>
      </Col>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    lang: state.app.lang,
    // avatar: state.login.avatar,
    // token: state.login.token
  }
}

Certificates = connect(mapStateToProps)(Certificates)
export default translate()(Certificates)
