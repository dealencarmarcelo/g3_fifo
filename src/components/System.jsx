import React, { Component } from 'react';
import { Button } from 'antd';
import moment from 'moment';
import "antd/dist/antd.css";
import Info from './Info';
import Attendance from './Attendance';
import '../App.css';

const GATES = [
    { name: 'A', queue: [], status: false },
    { name: 'B', queue: [], status: false },
    { name: 'C', queue: [], status: false },
    { name: 'D', queue: [], status: false },
]
var counter = 1;
export default class System extends Component {

    constructor(props) {
        super(props);
        this.state = this.initialState();
    }

    initialState = () => {
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
            arrivalTiming: 3,
            maxAttendance: 20,
            totalClients: 0,
            totalTiming: 0,
            totalArrival: 0,
            totalQueueTiming: 0,
            maxArrival: 3
        }
    };

    async startProcess() {
        await this.startGates();

        let { openedGates } = this.state;

        if (openedGates.length == 0) {
            alert("Não é possível iniciar o atendimento sem a abertura de pelo menos UM portão de atendimento.")
            return false;
        }

        await this.setState({ active: true });
        
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

        this.manageQueue();
    }

    async pauseProcess() {
        this.setState({ active: false });
        clearInterval(this.queueInterval);
        clearInterval(this.interval);
    }

    finishProcess = () => {
        this.state = this.initialState();

        GATES.map((v) => {
            v.queue = [];
            v.status = false;
        })
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
                        if (GATES[v].queue.length < GATES[current].queue.length) {
                            current = v;
                        }
                    })

                    let atendimento = Math.floor(Math.random() * maxAttendance);
                    let time = counter + atendimento
                    let queueTiming = 0

                    GATES[current].queue.map((v) => {
                        queueTiming += v.x
                    })

                    let queue = queueTiming;

                    totalQueueTiming += queue
                    
                    GATES[current].queue.push({ x: atendimento, y: time, queueTiming: queue })
                    
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

    verificarAtendimento = () => {
        let { totalClients, totalTiming } = this.state;

        GATES.map((v) => {
            if (v.queue[0] && v.queue[0].y <= counter) {
                totalClients += 1
                totalTiming += v.queue[0].x
                v.queue.shift()
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
                if (v.queue[0] && v.queue[0].y < counter) {
                    v.queue.shift()
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

        let { active, time, totalClients } = this.state;

        return (
            <div>
                { !active ? 
                        <Button className="System-button" onClick={() => this.startProcess()} type="primary">
                            Iniciar Atendimento
                        </Button> 
                        :
                        <Button className="System-button" onClick={() => this.pauseProcess()} type="primary" alert>
                            Pausar Atendimento
                        </Button>
                }
                <Button className="System-button" onClick={this.finishProcess} type="primary" danger>
                    Finalizar Atendimento
                </Button>
                <div className="System-timing">
                    <p>{time}</p>
                    <p>Total de clientes atendidos: {totalClients}</p>
                </div>
                <div className="System-components">
                    <Info   
                        gates={GATES} 
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