/**
 * Created by neal on 2017/6/7.
 */


/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    InteractionManager,
    Platform,
    UIManager
} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view'
import DefaultTabBar from './DefaultTabBar'
import AREA_JSON from './area.json';
const {height, width} = Dimensions.get('window');

export default class AddressView extends Component {

    static defaultProps = {
        commitFun: function (value) {
            console.log(value);
        },
        dissmissFun: function () {

        },
        lastAddress: [{
            label: "天津市",
            value: "120000"
        }, {
            label: "天津市",
            value: "120100"
        }, {
            label: "河西区",
            value: "120103"
        }]
    };

    constructor(props) {
        super(props);
        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true)
        }
        const {lastAddress} = props;
        let selectAddress = this.initAddress(lastAddress);
        this.state = {
            selectAddress
        }
    }

    initAddress(lastAddress) {
        let selectAddress = [
            {
                value: null,
                label: null,
                children: AREA_JSON,
            }, {
                value: null,
                label: null,
                children: null,
            }, {
                value: null,
                label: null,
                children: null,
            }];
        let array = null;

        function fun(array, value) {
            for (let item of array) {
                if (item.value === value) {
                    return item;
                }
            }
        }

        selectAddress = selectAddress.map((item, index) => {
            let result = fun(array ? array : AREA_JSON, lastAddress[index].value);
            if (result.children) {
                array = result.children;
            }
            return result;
        });
        return selectAddress
    }


    /**
     * 列表行
     * @param item
     * @param i
     * @returns {XML}
     */
    renderListItem(item, i) {
        let itemStyle = styles.itemStyle;
        let textStyle = styles.itemText;
        let {selectAddress} = this.state;
        if (item.label === selectAddress[i].label) {
            itemStyle = [itemStyle, {borderColor: 'red', borderBottomWidth: 1}];
            textStyle = [textStyle, {color: 'red'}]
        }
        return (
            <TouchableOpacity
                style={itemStyle}
                key={i + item.label}
                onPress={() => {
                    this.pressItem(item, i)
                }}
            >
                <Text style={textStyle}>{item.label}</Text>
            </TouchableOpacity>
        )
    }

    /**
     * 点击列表事件
     * @param item 选中数据
     * @param i 选中行数
     */
    pressItem(item, i) {
        let {selectAddress} = this.state;
        const initObj = {
            value: null,
            label: null,
            children: null,
        }
        let tempIndex = 0;
        if (i === 0) {
            selectAddress[0] = item;
            selectAddress[1] = initObj;
            selectAddress[2] = initObj;
            tempIndex = 1
        } else if (i === 1) {
            selectAddress[1] = item;
            selectAddress[2] = initObj;
            tempIndex = 2
        } else {
            selectAddress[2].value = item.value;
            selectAddress[2].label = item.label;
            tempIndex = 2
        }
        this.setState({selectAddress});
        InteractionManager.runAfterInteractions(() => {
            this.tabView.goToPage(tempIndex)
        })

    }

    render() {
        const {selectAddress} = this.state;
        return (
            <View style={styles.container}>
                <View style={{width: width, height: height / 2}}/>
                <View style={{width: width, height: 20, flexDirection: 'row'}}>
                    <TouchableOpacity onPress={() => {
                        this.props.dissmissFun && this.props.dissmissFun()
                    }}>
                        <Text style={{}}>取消</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        this.props.commitFun && this.props.commitFun(selectAddress)
                    }}>
                        <Text style={{color: 'red'}}>确定</Text>
                    </TouchableOpacity>
                </View>
                <ScrollableTabView
                    ref={(tabView) => {
                        this.tabView = tabView;
                    }}
                    renderTabBar={() => <DefaultTabBar />}
                >
                    {selectAddress.map((obj, i) => {
                        let array = (i === 0) ? AREA_JSON : selectAddress[i - 1].children;
                        if (array) {
                            return (
                                <ScrollView
                                    key={i}
                                    tabLabel={obj.label || '请选择'}
                                    style={styles.scrollStyleList}
                                >
                                    {array && array.map((obj2, j) => {
                                        return this.renderListItem(obj2, i)
                                    })}
                                </ScrollView>
                            )
                        }
                    })}
                </ScrollableTabView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    scrollStyleList: {
        width: width,
    },
    itemStyle: {
        width: width,
        height: 20,
    },
    itemText: {
        fontSize: 15,
        color: '#333333'
    },
});
