import React, { Component } from 'react';
import { UpCircleFilled, CarFilled } from '@ant-design/icons';
import { Tooltip } from 'antd';
import "antd/dist/antd.css";
import '../App.css';

export default class Attendance extends Component {

    constructor(props) {
        super(props);
    }



    render() {
        return (
            <div className="attendance">
                <div style={{ marginTop: 40 }}>
                    <div style={{ display: 'flex' }}>
                        {this.props.gates.map((v, i) => {
                            return (
                                <div className="gate" key={i}>
                                    <div>
                                        <p style={{ fontSize: 20 }}>Portão {v.name}</p>
                                        <UpCircleFilled style={{ fontSize: 35, color: (v.status ? '#00B045' : '#F40000') }}/>
                                    </div>
                                    <div style={{ marginTop: 40 }}>
                                        {v.queue.map((v, i) => {
                                            return (
                                                <div>
                                                    {i == 0 ? 
                                                            <div>
                                                                <p>Em atendimento</p>
                                                                <p>{v.x}s</p>
                                                                <Tooltip placement="top" title={"Atendimento: " + v.x + " - Máx. Fila: " + v.queueTiming}>
                                                                <p><CarFilled className="attendance-client"/></p>
                                                                </Tooltip>
                                                            </div> 
                                                            : 
                                                            <div>
                                                                <p>{v.x}s</p>
                                                                <Tooltip placement="top" title={"Atendimento: " + v.x + " - Fila: " + v.queueTiming}>
                                                                    <p><CarFilled className="queue-client"/></p>
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