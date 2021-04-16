import React from 'react';
import { ActivityIndicator, Dimensions, TouchableOpacity } from 'react-native';
import { Camera, Permissions, FaceDetector, FileSystem } from 'expo';
import styled from "styled-components";
import { MaterialIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get("window");

const CenterView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: cornflowerblue;
`;

const Text = styled.Text`
  color: white;
  font-size: 22px;
`;

const IconBar = styled.View`
  margin-top: 50px;
`;

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasPermission: null,
      cameraType: Camera.Constants.Type.front,
      smileDetected: false
    };
    this.cameraRef = React.createRef();
  }
  componentDidMount = async() => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    if (status === "granted") {
      this.setState({ hasPermission: true });
    } else {
      this.setState({ hasPermission: false });
    }
    
  };
  render() {
    const { hasPermission, cameraType, smileDetected } = this.state;
    if (hasPermission === true) {
      return (
        <CenterView>
          <Camera 
            style={{ 
              width: width -40,
              height: height / 1.5,
              borderRadius: 10,
              overflow: "hidden"
              }}
              type={cameraType}
              onFacesDetected={smileDetected ? null : this.onFacesDetected}
              faceDetectionClassifications={{   
                detectLandmarks: FaceDetector.Constants.Landmarks.all,
                runClassifications: FaceDetector.Constants.Classifications.all
              }}
              ref={this.cameraRef} 
            />
            <IconBar>
              <TouchableOpacity onPress={this.switchCameraType}>
              <MaterialIcons 
                name={
                  cameraType === Camera.Constants.Type.front 
                    ? "camera-rear"
                    : "camera-front"
                  }
                  color="white"
                  size={50}
                />
              </TouchableOpacity>    
            </IconBar>
        </CenterView>
      );
    } else if (hasPermission === false ){
      return (
        <CenterView>
          <Text>Don't have permmission for this</Text>
        </CenterView>
      );
    } else {
      return (
        <CenterView>
          <ActivityIndicator />
        </CenterView>
      );
    }
  }
  switchCameraType = () => {
    const { cameraType } = this.state;
    if(cameraType === Camera.Constants.Type.front){
      this.setState({
        cameraType: Camera.Constants.Type.back
      });
    } else {
      this.setState({
        cameraType: Camera.Constants.Type.front
      });
    }
  };


onFacesDetected = ({ faces }) => {
  const face = faces[0];
  if (face) {
    if (face.smilingProbability > 0.7 ) {
      this.setState({
        smileDetected: true
      });
      this.takePhoto();
    }
  }
};
takePhoto = async () => {
  try {
  if (this.cameraRef.current) {
    let {uri} = await this.cameraRef.current.takePictureAsync({
      quality: 1
  });
  if (uri) {
    this.savePhoto(uri);
  }
  }
} catch (error) {
  alert(error);
  this.setState({
    smileDetected: false
  });
}
};
savePhoto = async uri => {};
}