import React, {Component} from 'react';
import {FlatList} from "react-native";
import {
  Container,
  HJeader,
  Title,
  Content,
  Button,
  Icon,
  Left,
  Right,
  Body,
  Text,
  Form, Item, Label, Input

} from 'native-base';
import style from "./styles";
import moment from "moment";
import {validate} from "../../theme/utils/validation";

const configScreen = {
{
  header:{
    title:"Login"
  }
}
;
import t from 'tcomb-form-native';

const _Form = t.form.Form;
const Age = t.refinement(
  t.Number, function (n) {
    return n >= 18;
  });
t.Number.getValidationErrorMessage = function (value, path, context) {
  if (!value) {
    return "empty number";
  } else if(!Number.isInteger(value)) {
    return "bad number";
  }
}
Age.getValidationErrorMessage=function(value,path,context){
return "bad"
}


