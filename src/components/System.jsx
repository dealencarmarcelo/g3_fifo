import React, { Component } from 'react';
import { Checkbox, Button } from 'antd';
import moment from 'moment';
import "antd/dist/antd.css";
import Info from './Info';
import Attendance from './Attendance';
import '../App.css';

const GATES = [
    { name: 'A', data: [], status: false },
    { name: 'B', data: [], status: false },
    { name: 'C', data: [], status: false },
    { name: 'D', data: [], status: false },
    { name: 'E', data: [], status: false },
    { name: 'F', data: [], status: false }
]
const MAX_RANDOM = 20;
const MAX_CHEGADA = 2;

var counter = 1;
// let queueInterval = null;

export default class System extends Component {

    constructor(props) {
        super(props);
        this.state = this._initialState();
    }

    _initialState = () => {
        return {
            time: moment()
                .hour(0)
                .minute(0)
                .second(0)
                .format('HH : mm : ss'),
            active: false,
            openedGates: [],
            atendimentoMedio: 0,
            queueTiming: 0,
            arrivalTiming: 1,
            maxAttendance: 20,
            totalClients: 0,
            totalTiming: 0,
            totalArrival: 0,
            totalQueueTiming: 0,
            maxArrival: 2
        }
    };

    startTimer = () => {
        this.interval = setInterval(() => {
            this.setState({
                time: moment()
                    .hour(0)
                    .minute(0)
                    .second(counter++)
                    .format('HH : mm : ss'),
            });
            this.verificarAtendimento();
        }, 1000);
    }

    async startProcess() {
        await this.startGates();

        let { openedGates } = this.state;

        if (openedGates.length == 0) {
            alert("Não é possível iniciar o atendimento sem a abertura de pelo menos UM atendente.")
            return false;
        }

        await this.setState({ active: true });
        this.startTimer();
        this.manageQueue();
    }

    finishProcess = () => {
        this.setState({
            time: moment()
                .hour(0)
                .minute(0)
                .second(0)
                .format('HH : mm : ss'),
            active: false,
            openedGates: [],
            atendimentoMedio: 0,
            queueTiming: 0,
            arrivalTiming: 1,
            maxAttendance: 20,
            totalClients: 0,
            totalTiming: 0,
            totalArrival: 0,
            totalQueueTiming: 0,
            maxArrival: 2
        })

        GATES.map((v) => {
            v.data = [];
            v.status = false;
        })
    }

    async pauseProcess() {
        this.setState({ active: false });
        clearInterval(this.queueInterval);
        clearInterval(this.interval);
    }

    manageQueue = () => {
        var { arrivalTiming } = this.state;
        this.clearQueue();
        this.queueInterval = setInterval(() => {
            
            var { active, maxAttendance, totalQueueTiming, totalArrival, maxArrival } = this.state;
            if (active) {

                this.validateGates()
                
                let { openedGates } = this.state;
                let random = Math.floor(Math.random() * maxArrival) + 1;
                
                let current = openedGates[0]

                for (let i = 0; i < random; i++) {
                    openedGates.map((v) => {
                        if (GATES[v].data.length < GATES[current].data.length) {
                            current = v;
                        }
                    })

                    let atendimento = Math.floor(Math.random() * maxAttendance);
                    let time = counter + atendimento
                    let queueTiming = 0

                    GATES[current].data.map((v) => {
                        queueTiming += v.x
                    })

                    let queue = queueTiming;

                    totalQueueTiming += queue
                    
                    GATES[current].data.push({ x: atendimento, y: time, queueTiming: queue })
                    
                    totalArrival += 1

                    this.setState({
                        totalQueueTiming: totalQueueTiming,
                        totalArrival: totalArrival
                    })
                }
                
                this.setMetrics();
            }
        }, arrivalTiming * 1000)
    }

    startGates = () => {
        let indexes = []
        GATES.map((v, i) => {
            if (v.status == true) {
                indexes.push(i);
            }
        })

        this.setState({
            openedGates: indexes
        })
    }

    validateGates = () => {
        let indexes = []
        GATES.map((v, i) => {
            if (v.status == true) {
                indexes.push(i);
            }
        })

        this.setState({
            openedGates: indexes
        })
    }

    verificarAtendimento = () => {
        let { totalClients, totalTiming } = this.state;

        GATES.map((v) => {
            if (v.data[0] && v.data[0].y <= counter) {
                totalClients += 1
                totalTiming += v.data[0].x
                v.data.shift()
                this.setState({
                    totalClients: totalClients,
                    totalTiming: totalTiming
                })
            }
        })
        this.setMetrics();
    }

    clearQueue = () => {
        this.queueClearInterval = setInterval(() => {
            GATES.map((v) => {
                if (v.data[0] && v.data[0].y < counter) {
                    v.data.shift()
                }
            })
        }, 1000)
    }

    setArraivalTiming = (value) => {
        this.setState({
            arrivalTiming: value
        })
    }

    setMaxAttendanceTiming = (value) => {
        this.setState({
            maxAttendance: value
        })
    }

    setMaxArrivalTiming = (value) => {
        this.setState({
            maxArrival: value
        })
    }

    setMetrics = () => {
        let { totalClients, totalTiming, totalQueueTiming, totalArrival } = this.state;
        
        if (totalClients > 0) {
            let average = (totalTiming / totalClients)
            
            this.setState({
                atendimentoMedio: average,
            })
        }

        if (totalArrival > 0) {
            let queue = (totalQueueTiming / totalClients)
            
            this.setState({
                queueTiming: queue
            })
        }
    }

    render() {

        let { active } = this.state;

        return (
            <div>
                { !active ? <Button className="System-button" onClick={() => this.startProcess()} type="primary">
                            Iniciar Atendimento
                        </Button> :
                        <Button className="System-button" onClick={() => this.pauseProcess()} type="primary" danger>
                            Pausar Atendimento
                        </Button>
                }
                <Button className="System-button" onClick={this.finishProcess} type="primary">
                    Finalizar Atendimento
                </Button>
                <div className="System-timing">
                    <span>Tempo de atendimento: {this.state.time}</span>
                </div>
                <div className="System-components">
                    <Info gates={GATES} 
                        atendimentoMedio={this.state.atendimentoMedio} 
                        queueTiming={this.state.queueTiming} 
                        setArraivalTiming={this.setArraivalTiming}
                        setMaxAttendanceTiming={this.setMaxAttendanceTiming}
                        setMaxArrival={this.setMaxArrivalTiming}
                        totalClients={this.totalClients}
                        active={active}
                    >
                    </Info>
                    <Attendance gates={GATES}></Attendance>
                </div>
            </div>
        );
    }
}