import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { iterator } from 'rxjs/internal/symbol/iterator';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OptimizationService {
    constructor(private readonly prisma:PrismaService,
        private readonly configService:ConfigService
    ){}

    async trsggerReRoute(){
        const pendingDeliveries=await this.prisma.delivery.findMany({
            where:{status:'PENDING'},
            include:{brigade:true}
        })
        if(pendingDeliveries.length===0){
            return {message:'Немає замовлень для оптимізації'}
        }
        const availableVehicles=await this.prisma.vehicle.findMany({
            where:{status:'IDLE'}
        })

        if(availableVehicles.length===0){
            return {message:'немає вільних машин'}
        }

        const payload={
            vehicles:availableVehicles.map(v=>({
               id:v.id,
               lat:v.lat,
               ltg:v.lng
            })),
            tasks:pendingDeliveries.map(p=>({
                deliveryId:p.id,
                lat:p.brigade.lat,
                ltg:p.brigade.lng,
                priority:p.priority,
            }))
        }

        try {
            const pythonApiURL=this.configService.get<string>('PYTHON_MICROSERVICE_URL') || 'http://localhost:8000/optimize'

            const res=await fetch(pythonApiURL,{
                method:"POST",
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify(payload)
            })
            if(!res.ok){
                throw new Error(`Помилка від python ${res.statusText}`)
            }
            const data=await res.json()

            const updatePromise=data.map((item:any)=>{
                return this.prisma.delivery.update({
                    where:{id:item.deliveryId},
                    data:{
                        stepOrder:item.stepOrder
                    },
                });
            });
            await this.prisma.$transaction(updatePromise)
            
            return {
                succes:true,
                message:'Маршрути успішно перераховані',
                optimizedCount:data.length
            }
        } catch (error) {
            console.error('помилка fetch запиту ',error)
            throw new InternalServerErrorException('Мікросервіс не доступний')
        }
    }
}
