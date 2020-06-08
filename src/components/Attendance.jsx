import React, { Component } from 'react';
import { UpCircleFilled, CarFilled } from '@ant-design/icons';
import { Divider, Tooltip } from 'antd';
import moment from 'moment';
import "antd/dist/antd.css";

export default class Attendance extends Component {

    constructor(props) {
        super(props);
    }



    render() {
        return (
            <div style={{ width: '80%', height: 'auto', marginLeft: 'auto', marginRight: 'auto', display: 'inline-block' }}>
                <div style={{ marginTop: 40 }}>
                    <div style={{ display: 'flex' }}>
                        {this.props.gates.map((v, i) => {
                            return (
                                <div key={i} style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                                    <div>
                                        <p style={{ fontSize: 20 }}>{v.name}</p>
                                        <UpCircleFilled style={{ fontSize: 35, color: (v.status ? 'green' : 'red') }}/>
                                        <p style={{ marginTop: 10 }}>Clientes: {v.data.length}</p>
                                    </div>
                                    <div style={{ marginTop: 40 }}>
                                        {v.data.map((v, i) => {
                                            return (
                                                <div>
                                                    {i == 0 ? <div>
                                                                <p>{v.x}s</p>
                                                                <Tooltip placement="top" title={"Atendimento: " + v.x + " - Fila: " + v.queueTiming}>
                                                                    <p><CarFilled style={{ fontSize: 20, color: 'green' }} /></p>
                                                                </Tooltip>
                                                                <Divider style={{ border: 2, borderStyle: 'solid' }} />
                                                            </div> : 
                                                            <div>
                                                                <p>{v.x}s</p>
                                                                <Tooltip placement="top" title={"Atendimento: " + v.x + " - Fila: " + v.queueTiming}>
                                                                    <p><CarFilled style={{ fontSize: 20, color: 'black' }} /></p>
                                                                </Tooltip>
                                                            </div>
                                                    }
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        );
    }
}