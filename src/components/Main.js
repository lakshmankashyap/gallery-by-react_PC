require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';


let imgDataArr = require('json!../data/imageDatas.json');

imgDataArr = (function (arr) {
  for (let i = 0; i < arr.length; i++) {
    arr[i].imageURL = require('../images/' + arr[i].fileName);
  }
  return arr;
})(imgDataArr);
console.info(imgDataArr);

/*
 * 获取区间内一个随机值
 * @param low ：小值
 * @param high ：大值
 */
function getRangeRandom(low, high) {
  return Math.ceil((high - low) * Math.random() + low);
}

class ControllerUnit extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.stopPropagation();
    e.preventDefault();

    if (this.props.arrangeImg.isCenter) {
      this.props.inverseImg();
    } else {
      this.props.centerImg();
    }
  }

  render() {
    var controllerUnitClass = 'controller-unit';
    if (this.props.arrangeImg.isCenter) {
      controllerUnitClass += ' controller-unit-toCenter';
      if (this.props.arrangeImg.isInverse) {
        controllerUnitClass += ' controller-unit-toInverse'
      }
    }

    return (
      <span
        className={controllerUnitClass}
        onClick={this.handleClick}></span>
    )
  }
}

class ImgFigure extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.stopPropagation();
    e.preventDefault();

    //如果图片居中，翻转；如果图片不居中时，居中
    if (this.props.arrange.isCenter) {
      this.props.beInverse();
    } else {
      this.props.beCenter();
    }
  }

  render() {
    var imgFigureStyle;
    /*设置样式：left 和 top
     *this.props.arrange.pos = {left:……,top:……}
     */
    if (this.props.arrange.pos) {
      imgFigureStyle = this.props.arrange.pos;
    }
    /*设置样式：transform:rateate(……deg)
     *this.props.arrange.rotate = ……
     */
    if (this.props.arrange.rotate) {
      ['-webkit-', '-moz', '-o-', '-ms-', ''].forEach(function (value) {
        imgFigureStyle[value + 'transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
      }.bind(this));
    }
    //居中的图片z-index最高
    if (this.props.arrange.isCenter) {
      imgFigureStyle['z-index'] = '100';
    } else {
      imgFigureStyle['z-index'] = '99';
    }
    let imgFigureClass = 'img-figure';
    // 为图片添加翻转样式
    if (this.props.arrange.isInverse) {
      imgFigureClass += ' img-figure-toInverse';
    }
    return (
      <figure
        className={imgFigureClass}
        style={imgFigureStyle}
        onClick={this.handleClick}>
        <img className="img"
             src={this.props.data.imageURL}
             alt={this.props.data.title}/>
        <figcaption
          className="img-title">
          <h2>{this.props.data.title}</h2>
        </figcaption>
        <div
          className="img-figure-back"
          onClick={this.handleClick}>
          <p>{this.props.data.desc}</p>
        </div>
      </figure>
    )
  }
}

class GalleryByReact extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imgsArrange: [
        // {
        //   pos:{
        //     left: 0,
        //     top 0:
        //   },
        //   rotate: 0,//旋转角度
        //   isInverse:false, //图片是否反面
        //   isCenter: false //图片是否居中
        // },
        // {
        //   pos:{
        //     left: 0,
        //     top 0:
        //   },
        //   rotate: 0,//旋转角度
        //   isInverse:false, //图片是否反面
        //   isCenter: false //图片是否居中
        // },
        // ……
      ]
    };
    this.posConst = {
      centerPos: {
        left: 0,
        top: 0
      },
      horPosRng: {
        lPosLeftRng: [0, 0],
        rPosLeftRng: [0, 0],
        verTopRng: [0, 0]
      },
      topPosRng: {
        leftRng: [0, 0],
        topRng: [0, 0]
      }
    }
  }

  /*
   * 重新布局所有图片
   * @param centerIndex ：居中图片的index
   * */
  reArrange(centerImgIndex) {
    var imgsArrange = this.state.imgsArrange,
      posConst = this.posConst;
    // 为中心图片位置信息赋值
    var centerImgArrange = imgsArrange.splice(centerImgIndex, 1);
    centerImgArrange[0].pos = {
      left: posConst.centerPos.left,
      top: posConst.centerPos.top
    };
    centerImgArrange[0].rotate = 0;
    centerImgArrange[0].isCenter = true;
    //为上方区域图片位置信息赋值
    var topImgNum = getRangeRandom(0, 1);
    var topImgIndex = getRangeRandom(0, imgsArrange.length - topImgNum);
    var topImgArrange = imgsArrange.splice(topImgIndex, topImgNum);
    topImgArrange.forEach(function (value, index) {
      topImgArrange[index].pos = {
        left: getRangeRandom(posConst.topPosRng.leftRng[0], posConst.topPosRng.leftRng[1]),
        top: getRangeRandom(posConst.topPosRng.topRng[0], posConst.topPosRng.topRng[1])
      };
      topImgArrange[index].rotate = getRangeRandom(-30, 30);
      topImgArrange.isCenter = false;
    });
    //为左侧和右侧区域图片位置信息赋值
    for (let i = 0; i < imgsArrange.length; i++) {
      //前半部分图片布局在左侧，后半部分图片布局在右侧
      let horRng;
      if (i <= imgsArrange.length / 2) {
        horRng = posConst.horPosRng.lPosLeftRng;
      } else {
        horRng = posConst.horPosRng.rPosLeftRng;
      }

      imgsArrange[i].pos = {
        left: getRangeRandom(horRng[0], horRng[1]),
        top: getRangeRandom(posConst.horPosRng.verTopRng[0], posConst.horPosRng.verTopRng[1])
      };
      imgsArrange[i].rotate = getRangeRandom(-30, 30);
      imgsArrange[i].isCenter = false;
    }

    //将上方图片信息和居中图片信息合并回imgsArrange
    if (topImgArrange && topImgArrange.length > 0) {
      topImgArrange.forEach(function (value, index) {
        imgsArrange.splice(topImgIndex, 0, topImgArrange[index]);
      })
    }
    imgsArrange.splice(centerImgIndex, 0, centerImgArrange[0]);


    //重新设置状态，引发组件的重新渲染
    this.setState({
      imgsArrange: imgsArrange
    });

  }

  /*
   *翻转图片
   * @param index 被翻转的图片的index
   * @return {Function}一个闭包函数，其中return一个真正待被执行的函数
   */
  inverse(imgIndex) {
    return (function () {
      var imgsArrange = this.state.imgsArrange;
      imgsArrange[imgIndex].isInverse = !imgsArrange[imgIndex].isInverse;
      this.setState({
        imgsArrange: imgsArrange
      })
    }.bind(this));
  }

  /*
   *翻转图片
   * @param index 被翻转的图片的index
   * @return {Function}一个闭包函数，其中return一个真正待被执行的函数
   */
  center(imgIndex) {
    return (function () {
      this.reArrange(imgIndex);
    }.bind(this));
  }

  //组件加载后，为图片计算其位置范围
  componentDidMount() {
    //获取舞台和图片的宽高
    var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
      stageConst = {
        stageWidth: stageDOM.scrollWidth,
        stageHeight: stageDOM.scrollHeight,
        stageHalfWidth: stageDOM.scrollWidth / 2,
        stageHalfHeight: stageDOM.scrollHeight / 2
      },
      imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),//取其中任意一个图片。所有图片DOM的宽高是相同的
      imgFigureConst = {
        imgfigureWidth: imgFigureDOM.scrollWidth,
        imgfigureHeight: imgFigureDOM.scrollHeight,
        imgfigureHalfWidth: imgFigureDOM.scrollWidth / 2,
        imgfigureHalfHeight: imgFigureDOM.scrollHeight / 2
      };

    // 为图片区域范围赋值
    this.posConst = {
      //图片中心点
      centerPos: {
        left: stageConst.stageHalfWidth - imgFigureConst.imgfigureHalfWidth,
        top: stageConst.stageHalfHeight - imgFigureConst.imgfigureHalfHeight
      },
      horPosRng: {
        lPosLeftRng: [-imgFigureConst.imgfigureHalfWidth, stageConst.stageHalfWidth - imgFigureConst.imgfigureHalfWidth * 3],
        rPosLeftRng: [stageConst.stageHalfWidth + imgFigureConst.imgfigureHalfWidth, stageConst.stageWidth - imgFigureConst.imgfigureHalfWidth],
        verTopRng: [-imgFigureConst.imgfigureHalfHeight, stageConst.stageHeight - imgFigureConst.imgfigureHalfHeight]
      },
      topPosRng: {
        leftRng: [stageConst.stageHalfWidth - imgFigureConst.imgfigureWidth, stageConst.stageHalfWidth],
        topRng: [-imgFigureConst.imgfigureHalfHeight, stageConst.stageHalfHeight - imgFigureConst.imgfigureHalfHeight * 3]
      }
    };

    this.reArrange(0);
  }

  render() {
    var ImgFigures = [], ControllerUnits = [];
    imgDataArr.forEach(function (value, index) {
      if (!this.state.imgsArrange[index]) {
        this.state.imgsArrange[index] = {
          pos: {
            left: 0,
            top: 0,
          },
          rotate: 0,//旋转角度
          isInverse: false, //图片是否反面
          isCenter: false //图片是否居中
        }
      }
      ImgFigures.push(
        <ImgFigure
          data={value}
          ref={'imgFigure' + index}
          arrange={this.state.imgsArrange[index]}
          beInverse={this.inverse(index)}
          beCenter={this.center(index)}/>);
      ControllerUnits.push(
        <ControllerUnit
          arrangeImg={this.state.imgsArrange[index]}
          inverseImg={this.inverse(index)}
          centerImg={this.center(index)}/>
      )
    }.bind(this));
    return (
      <section
        className="stage"
        ref='stage'>
        <section
          className="img-container">
          {ImgFigures}
        </section>
        <nav
          className="controller-container">
          {ControllerUnits}
        </nav>
      </section>
    );
  }
}

GalleryByReact.defaultProps = {};

export default GalleryByReact;
