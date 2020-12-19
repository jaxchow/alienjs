import {failedRes,successResData} from './RouterResultUtils'
export function PromiseAggregate(model,aggregate){
    return new Promise((resolve,reject)=>{
      model.native(function(err, bodyCollection) {
            bodyCollection
              .aggregate(aggregate)
              .toArray((err, results) => {
                if(err){
                  reject(err)
                }else{
                  resolve(results)
                }
              });
      }) 
    })
  }