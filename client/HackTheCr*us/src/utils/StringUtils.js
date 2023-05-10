export default class StringUtils{
    static levenshtein(a,b){
        const d = [];
        for(let i = 0; i <= a.length; i++){
            let inter = [];
            for(let j = 0; j <= b.length; j++){
                inter.push(0)
            }
            d.push(inter);
        }
        let cost = 0;
        for(let i = 0; i < a.length; i++){
            d[i][0] = i;
        }
        for(let j=0; j < b.length; j++){
            d[0][j] = j;

        }

        for(let i = 1; i <= a.length; i++){
            for(let j = 1 ; j <= b.length; j++){
                if(a.charAt(i-1) === b.charAt(j-1)){
                    cost = 0;
                }else{
                    cost = 1;
                }
                d[i][j] = Math.min(d[i-1][j]+1, Math.min(d[i][j-1]+1 , d[i-1][j-1] + cost));
            }
        }

        return d[a.length][b.length];
    }
}

