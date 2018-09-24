import React from "react";
import PropTypes from "prop-types";
import Icon from "../icon/icon";

import { Dimensions } from "react-native";
const windowWidth = Dimensions.get('window').width;
const windowhHeight = Dimensions.get('window').height;

import {
  View,
  Animated,
  Modal,
  TextInput,
  Image,
  Text,
  TouchableHighlight,
  TouchableWithoutFeedback,
  TouchableOpacity
} from "react-native";

import nativeStyle from "nativestyle";

import styles from "../../styles/styles.js";

export class EmailInput extends React.Component {
  render() {
    const { value, borderStyle } = this.props;
    const styleNames = nativeStyle(styles);
    return (
      <View style={styleNames("inputContainer", {
        "inputContainerValid": borderStyle === true,
        "inputContainerNotValid": borderStyle === false
      }, this.props.style)}>
        <TextInput
          testID={this.props.testID}
          value={value}
          onChangeText={this.props.onChangeText}
          onFocus={this.props.onFocus}
          onBlur={this.props.onBlur}
          placeholder={this.props.placeholder}
          //ref={ref => this.input = ref}
          style={styleNames("input", {
            "inputLarge": this.props.size === "large"
          })}
          keyboardType="email-address"
          returnKeyType={this.props.returnKeyType}
          onSubmitEditing={this.props.onSubmitEditing}
          autoCorrect={false}
          autoCapitalize="none"/>
          {
            borderStyle === false ? (<Image style={styles.inputImage} source={require('../../img/symbols-icons-error_red.png')} />) : null
          }
      </View>
    );
  }
}

EmailInput.propTypes = {
  value: PropTypes.string,
  placeholder: PropTypes.string,
  size: PropTypes.string,
  borderStyle: PropTypes.any,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  returnKeyType: PropTypes.string,
  onSubmitEditing: PropTypes.func,
  onChangeText: PropTypes.func,
  style: PropTypes.string,
  testID: PropTypes.string,
}

EmailInput.defaultProps = {
  borderStyle: null,
  placeholder: "Email"
}

export class PasswordInput extends React.Component {
  render() {
    const { value, secureTextEntry, borderStyle } = this.props;
    const styleNames = nativeStyle(styles);
    return (
      <View style={styleNames("inputContainer", {
        "inputContainerValid": borderStyle === true,
        "inputContainerNotValid": borderStyle === false
      })}>
        <TextInput
          testID={this.props.testID}
          value={value}
          onFocus={this.props.onFocus}
          onBlur={this.props.onBlur}
          onChangeText={this.props.onChangeText}
          placeholder={this.props.placeholder}
          style={styleNames("input", {
            "inputLarge": this.props.size === "large"
          })}
          returnKeyType={this.props.returnKeyType}
          onSubmitEditing={this.props.onSubmitEditing}
          secureTextEntry={secureTextEntry}/>
          <TouchableHighlight underlayColor={"#fff"} onPress={this.props.changeSecureTextEntry}>
            {
              secureTextEntry ?
              (
                <Image
                  style={styleNames("inputImage", {
                    "inputImageLarge": this.props.size === "large"
                  })}
                  source={require('../../img/symbols-icons-show_gray.png')} />
                ) : (
                  <Image
                    style={styleNames("inputImage", {
                      "inputImageLarge": this.props.size === "large"
                    })}
                    source={require('../../img/symbols-icons-show.png')} />
                )
            }
          </TouchableHighlight>
      </View>
    );
  }
}

PasswordInput.propTypes = {
  value: PropTypes.string,
  placeholder: PropTypes.string,
  size: PropTypes.string,
  borderStyle: PropTypes.any,
  secureTextEntry: PropTypes.any,
  onChangeText: PropTypes.any,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  returnKeyType: PropTypes.string,
  onSubmitEditing: PropTypes.any,
  changeSecureTextEntry: PropTypes.any,
  testID: PropTypes.string,
}

PasswordInput.defaultProps = {
  borderStyle: null,
  placeholder: "Password"
}

export class SelectInput extends React.Component {
  state = {
    isOpen: false,
    drillUp: false
  }
  onPress = () => {
    this._container.measureInWindow((x, y, containerWidth, containerHeight) => {
      this.setState({
        drillUp: windowhHeight - y < 200,
        x,
        y,
        containerWidth,
        containerHeight,
        isOpen: !this.state.isOpen
      });
    });
  }
  onClose = () => {
    this.setState({
      isOpen: false
    });
  }
  onSelect = (o) => {
    this.props.onSelect(o);
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  generateDropdownStyle() {
    const directionStyle = this.state.drillUp ? {
      bottom: windowhHeight - this.state.y - 8 - this.state.containerHeight,
    } : {
      top: this.props.isFeed ? this.state.y - 6 : this.state.y + this.state.containerHeight - 1,
    };

    return {
      width: this.state.containerWidth,
      left: this.state.x,
      ...directionStyle,
      // top: isFeed ? this.state.y - 6 : this.state.y + this.state.containerHeight - 1,
      // transform: [{
      //   translateY: this.state.y,
      //   translateX: this.state.x
      // }]
    };
  }
  render() {
    const { value, options, isFeed } = this.props;
    const styleNames = nativeStyle(styles);

    return (
      <TouchableWithoutFeedback onPress={this.onPress}>
        <View style={styleNames("selectContainer", {
          "feedSelectContainer": isFeed
        })} ref={component => this._container = component}>
          {
            this.state.isOpen && isFeed ? null : (
              <InputContainer
                isOpen={this.state.isOpen}
                isFeed={isFeed}
                styleNames={styleNames}
                value={value}
              />
            )
          }
          <Modal visible={this.state.isOpen} transparent={true}>
            <TouchableWithoutFeedback onPress={this.onClose}>
              <View style={styleNames("dropdownWrapper", {
                "dropdownWrapperBg": isFeed
              })}>
                <Animated.View style={[styles.dropdown, styles.dropdownSelect, this.generateDropdownStyle(), styleNames({
                  "feedDropdown": isFeed,
                  "dropdownDrilledUp": this.state.drillUp
                })]}>
                  {
                    isFeed && !this.state.drillUp ? (
                      <InputContainer
                        isOpen={this.state.isOpen}
                        isFeed={isFeed}
                        styleNames={styleNames}
                        value={value}
                      />
                    ) : null
                  }
                  {
                     options ? options.map(o => (
                      <TouchableOpacity onPress={this.onSelect.bind(this, o)} key={o.id}>
                        <View style={styleNames("option", "flexRow", {
                          "activeOption": this.props.value.id === o.id
                        })}>
                          <Text style={styles.optionText}>
                            {o.name}
                          </Text>
                          {
                            this.props.value.id === o.id ? (
                              <View style={styles.optionIcon}>
                                <Icon name="sent" size={16}/>
                              </View>
                            ) : null
                          }
                        </View>
                      </TouchableOpacity>
                    )) : null
                  }
                  {
                    isFeed && this.state.drillUp ? (
                      <InputContainer
                        isOpen={this.state.isOpen}
                        drillUp={true}
                        isFeed={isFeed}
                        styleNames={styleNames}
                        value={value}
                      />
                    ) : null
                  }
                </Animated.View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

SelectInput.propTypes = {
  value: PropTypes.shape({
    id: PropTypes.any,
    name: PropTypes.string,
  }),
  options: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.any,
    name: PropTypes.string,
  })),
  onPress: PropTypes.func,
  onSelect: PropTypes.func,
  isFeed: PropTypes.bool
}

SelectInput.defaultProps = {
  isFeed: false
}

const InputContainer = ({ isOpen, isFeed, drillUp, styleNames, value }) => (
  <View style={styleNames("inputContainer", {
    "whiteBg": true,
    "borderBottomStraight": isOpen && !drillUp,
    "borderTopStraight": isOpen && drillUp,
    "feedInputContainerBorderBottom": isFeed && isOpen && !drillUp,
    "feedInputContainerBorderTop": isFeed && isOpen && drillUp
  })}>
    <Text style={styleNames("inputSelectText", "alignSelfStart", "flex", {
      "feedInputSelectText": isFeed && !isOpen,
    })}>
      {value.name}
    </Text>
    <View style={[styles.inputImage, styles.alignSelfEnd, styleNames({
      "feedInputImage": isFeed && !isOpen
    })]}>
      <Icon
        size={isFeed && !isOpen ? 14 : 22}
        color={!isFeed ? "blue" : isOpen ? "blue" : "gray"}
        name={isOpen ? "dropdown-opened" : "dropdown"}
      />
    </View>
  </View>
);

InputContainer.propTypes = {
  isOpen: PropTypes.bool,
  isFeed: PropTypes.bool,
  drillUp: PropTypes.bool,
  styleNames: PropTypes.func,
  value: PropTypes.object
}

InputContainer.defaultProps = {
  drillUp: false
}

export class InputItem extends React.Component {
  render() {
    return (
      <View style={styles.itemContainer}>
        <Text style={styles.itemTitle}>{this.props.title}</Text>
        {this.props.children}
      </View>
    );
  }
}

InputItem.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.any
}

export class Dropdown extends React.Component {
  state = {
    isOpen: false,
    drillUp: false
  }
  onPress = () => {
    this._container.measureInWindow((x, y, containerWidth, containerHeight) => {
      this.setState({
        drillUp: windowhHeight - y < 200,
        x,
        y,
        containerWidth,
        containerHeight,
        isOpen: !this.state.isOpen
      });
    });
  }
  onClose = () => {
    this.setState({
      isOpen: false
    });
  }
  generateDropdownStyle() {
    const verticalStyle = this.state.drillUp ? {
      bottom: windowhHeight - this.state.y,
    } : {
      top: this.state.y + this.state.containerHeight - 1,
    };

    const horizontalStyle = (windowWidth / 2) > this.state.x ? {
      left: this.state.x
    } : {
      right: windowWidth - this.state.x - this.state.containerWidth - 8
    };

    return {
      ...verticalStyle,
      ...horizontalStyle,
    };
  }
  render() {
    const styleNames = nativeStyle(styles);
    return (
      <TouchableWithoutFeedback onPress={this.onPress}>
        <View
          style={styles.selectContainer}
          ref={component => this._container = component}>
          {
            this.props.children
          }
          <Modal visible={this.state.isOpen} transparent={true}>
            <TouchableWithoutFeedback onPress={this.onClose}>
              <View style={[styles.dropdownWrapper, styles.dropdownWrapperBg]}>
                <Animated.View style={[
                  styles.dropdown, this.generateDropdownStyle(), styleNames({
                  "dropdownDrilledUp": this.state.drillUp
                })]}>
                  {this.props.render()}
                </Animated.View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

Dropdown.propTypes = {
  render: PropTypes.func.isRequired,
  children: PropTypes.any
}
