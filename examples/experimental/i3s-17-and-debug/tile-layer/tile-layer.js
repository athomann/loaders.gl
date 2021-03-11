import GL from '@luma.gl/constants';
import {Geometry} from '@luma.gl/core';
import {COORDINATE_SYSTEM} from '@deck.gl/core';
import {Tile3DLayer} from '@deck.gl/geo-layers';
import MeshLayer from '../mesh-layer/mesh-layer';

const SINGLE_DATA = [0];
// Use our custom MeshLayer
export default class TileLayer extends Tile3DLayer {
  _makeSimpleMeshLayer(tileHeader, oldLayer) {
    const content = tileHeader.content;
    const {attributes, modelMatrix, cartographicOrigin, texture, material} = content;
    const {pickable, autoHighlight} = this.props;

    const geometry =
      (oldLayer && oldLayer.props.mesh) ||
      new Geometry({
        drawMode: GL.TRIANGLES,
        attributes: getMeshGeometry(attributes)
      });

    return new MeshLayer(
      this.getSubLayerProps({
        id: 'mesh'
      }),
      {
        id: `${this.id}-mesh-${tileHeader.id}`,
        mesh: geometry,
        data: SINGLE_DATA,
        getPosition: [0, 0, 0],
        getColor: [255, 255, 255],
        texture,
        material,
        modelMatrix,
        coordinateOrigin: cartographicOrigin,
        coordinateSystem: COORDINATE_SYSTEM.METER_OFFSETS,
        pickable,
        autoHighlight,
        highlightColor: [0, 0, 255, 150]
      }
    );
  }
}

function getMeshGeometry(contentAttributes) {
  const attributes = {};
  attributes.positions = {
    ...contentAttributes.positions,
    value: new Float32Array(contentAttributes.positions.value)
  };
  if (contentAttributes.normals) {
    attributes.normals = contentAttributes.normals;
  }
  if (contentAttributes.texCoords) {
    attributes.texCoords = contentAttributes.texCoords;
  }
  if (contentAttributes.colors) {
    attributes.colors = contentAttributes.colors;
  }
  if (contentAttributes.featureIds) {
    attributes.featureIds = contentAttributes.featureIds;
  }
  return attributes;
}