import React, { useState } from 'react';
import {
  MDBListGroup,
  MDBListGroupItem,
  MDBCollapse,
  MDBIcon,
  MDBRipple,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBDropdownLink
} from 'mdb-react-ui-kit';

export default function Sidebar() {
  const [collapse1, setCollapse1] = useState(true);
  const [collapse2, setCollapse2] = useState(false);

  return (
    <div className="position-sticky">
      <MDBListGroup flush className="mx-3 mt-4">
        <MDBRipple rippleTag="span">
          <MDBListGroupItem tag="a" href="#" action className="border-0 border-bottom rounded" onClick={() => setCollapse1(!collapse1)}>
            <MDBIcon fas icon="tachometer-alt me-3" />
            Expanded menu
          </MDBListGroupItem>
        </MDBRipple>

        <MDBCollapse show={collapse1}>
          <MDBListGroup flush>
            <MDBListGroupItem className="py-1" tag="a" action href="#">
              Link 1
            </MDBListGroupItem>
            <MDBListGroupItem className="py-1" tag="a" action href="#">
              Link 2
            </MDBListGroupItem>
            <MDBListGroupItem className="py-1" tag="a" action href="#">
              Link 3
            </MDBListGroupItem>
            <MDBListGroupItem className="py-1" tag="a" action href="#">
              Link 4
            </MDBListGroupItem>
          </MDBListGroup>
        </MDBCollapse>

      </MDBListGroup>

      <MDBListGroup flush className="mx-3">
        <MDBRipple rippleTag="span">
          <MDBListGroupItem tag="a" href="#" action className="border-0 border-bottom rounded" onClick={() => setCollapse2(!collapse2)}>
            <MDBIcon fas icon="chart-area me-3" />
            Collapsed menu
          </MDBListGroupItem>
        </MDBRipple>

        <MDBCollapse show={collapse2}>
          <MDBListGroup flush>
            <MDBListGroupItem className="py-1" tag="a" action href="#">
              Link 1
            </MDBListGroupItem>
            <MDBListGroupItem className="py-1" tag="a" action href="#">
              Link 2
            </MDBListGroupItem>
            <MDBListGroupItem className="py-1" tag="a" action href="#">
              Link 3
            </MDBListGroupItem>
            <MDBListGroupItem className="py-1" tag="a" action href="#">
              Link 4
            </MDBListGroupItem>
          </MDBListGroup>
        </MDBCollapse>
      </MDBListGroup>
    </div>
  );
}
