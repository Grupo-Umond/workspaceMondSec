import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';

const HomeScreen = ({ navigation }) => {
    const [errorMessage, setErrorMessage] = useState('');
    return(
        <View> <Text>Ta funcionando</Text></View>
    );

};
export default HomeScreen;