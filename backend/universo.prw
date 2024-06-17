//------------------------------------------------------------------------------
/*/{Protheus.doc} universo
	Executa o App da demonstra��o do Universo.
	@type		function
	@author		TOTVS
	@since		18/06/2024
	@version	12.1.2310
/*/
//------------------------------------------------------------------------------
User Function universo()
	FwCallApp("universo_totvs24")
Return

//------------------------------------------------------------------------------
/*/{Protheus.doc} JsToAdvpl
	Envia os comandos para o frontend de acordo com o tipo da chamada enviada pelo
	mesmo.
	@type		function
	@author		TOTVS
	@since		18/06/2024
	@version	12.1.2310

	@param oWebChannel object, objeto com o socket aberto para comunica��o
	@param cType character, tipo/identificador para a chamada
	@param cContent character, conte�do da chamada
/*/
//------------------------------------------------------------------------------
Static Function JsToAdvpl(oWebChannel,cType,cContent)
    If cType == 'checkBalance'
        oWebChannel:AdvPLToJS('checkBalance', cValToChar(MostrarSaldo(cContent)))
	ElseIf cType == 'getParam'
		oWebChannel:AdvPLToJS('setParam', SuperGetMv(cContent))
    EndIf
Return

//------------------------------------------------------------------------------
/*/{Protheus.doc} MostrarSaldo
	Realiza a chamada do c�lculo de saldo para determinado produto.
	@type		function
	@author		TOTVS
	@since		18/06/2024
	@version	12.1.2310

	@param cProduto character, id do produto

	@return nSaldo numeric, saldo do produto
/*/
//------------------------------------------------------------------------------
Static Function MostrarSaldo(cProduto)
	Local nSaldo := 0
	Local aArea := GetArea()
	Local aAreaSB2 := SB2->(GetArea())

	SB2->(dbSetOrder(1))
	If SB2->(dbSeek(xFilial("SB2") + cProduto))
		nSaldo := SaldoSB2()
	EndIf

	RestArea(aAreaSB2)
	RestArea(aArea)
Return nSaldo
